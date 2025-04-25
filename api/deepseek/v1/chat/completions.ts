import type { VercelRequest, VercelResponse } from '@vercel/node';

// Read the API key securely from Vercel Environment Variables
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Ensure it's a POST request
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY environment variable not set.');
    return res.status(500).json({ error: 'Server configuration error: API key missing.' });
  }

  try {
    const forwardResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        // Forward other relevant headers if needed, be careful not to forward sensitive ones
      },
      body: JSON.stringify(req.body), // Forward the body from the frontend request
    });

    // Check if the request to DeepSeek API failed
    if (!forwardResponse.ok) {
      const errorBody = await forwardResponse.text();
      console.error(`DeepSeek API Error (${forwardResponse.status}): ${errorBody}`);
      // Send DeepSeek's error status and body back to the client
      return res.status(forwardResponse.status).send(errorBody);
    }

    // Send DeepSeek's successful response back to the client
    const responseData = await forwardResponse.json();
    return res.status(200).json(responseData);

  } catch (error: any) {
    console.error('Error in proxy function:', error);
    return res.status(500).json({ error: 'Internal Server Error proxying request.', details: error.message });
  }
} 