import { Course, Recommendation } from '@/models/types';

// Retrieve the API key from environment variables
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export const semanticSearchDeepseek = async (
  interests: string,
  candidateCourses: Course[]
): Promise<Recommendation[]> => {
  console.log(`[semanticSearchDeepseek] Starting. Interests: ${interests}, Candidates: ${candidateCourses.length}`);
  if (!DEEPSEEK_API_KEY) {
    console.error("❌ DeepSeek API Key not found. Make sure VITE_DEEPSEEK_API_KEY is set in your .env file.");
    return [];
  }

  const prompt = `You are an NYU course recommender bot. A student said they are interested in: "${interests}".
Below is a list of available NYU courses. Recommend the top 5 most relevant ones and explain why for each:

Courses:
${candidateCourses.map(c => `${c.course_id}: ${c.course_name}`).join('\n')}

Return your response as a JSON array with this format:
[
  {
    "course_id": "...",
    "reason": "..."
  },
  ...
]`;

  const headers = {
    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json"
  };

  const payload = {
    "model": "deepseek-chat",
    "messages": [{ "role": "user", "content": prompt }],
    "temperature": 0.7
  };

  try {
    console.log("[semanticSearchDeepseek] Making fetch call to /api/deepseek/v1/chat/completions");
    // Use the proxied path
    const response = await fetch("/api/deepseek/v1/chat/completions", {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    console.log(`[semanticSearchDeepseek] Fetch response status: ${response.status}`);

    if (!response.ok) {
      console.error("❌ API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    console.log("[semanticSearchDeepseek] Received data from response.json():", data);
    let result = [];
    try {
        const rawContent = data.choices[0].message.content;
        console.log("[semanticSearchDeepseek] Raw content from API:", rawContent);
        // Extract JSON content from potential markdown code block
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : rawContent;
        console.log("[semanticSearchDeepseek] Attempting to parse JSON string:", jsonString);
        result = JSON.parse(jsonString);
        console.log("[semanticSearchDeepseek] Successfully parsed JSON:", result);
    } catch (parseError) {
        console.error("❌ Failed to parse JSON response from API:", parseError);
        console.error("Raw API Response Content:", data.choices[0].message.content); // Log original raw content
        return []; // Return empty if parsing fails
    }

    const recommendations: Recommendation[] = [];
    for (const item of result) {
      // Extract the actual course ID from the string returned by the API (e.g., "ID: Name" -> "ID")
      const apiCourseId = item.course_id.split(':')[0].trim();
      const matchedCourse = candidateCourses.find(c => c.course_id === apiCourseId);
      if (matchedCourse) {
        console.log(`[semanticSearchDeepseek] Found match for ${apiCourseId}`); // Add log for confirmation
        recommendations.push({
          course_id: matchedCourse.course_id,
          title: matchedCourse.course_name,
          description: matchedCourse.description || '',
          match_reason: item.reason,
          course: matchedCourse,
          reason: item.reason,
          score: 1 // Since DeepSeek provides qualitative matching
        });
      }
    }
    
    console.log("[semanticSearchDeepseek] Processed recommendations:", recommendations);
    return recommendations;
  } catch (error) {
    console.error("❌ Error processing DeepSeek response:", error);
    return [];
  }
}; 