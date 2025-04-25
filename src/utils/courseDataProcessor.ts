
import { Course, Recommendation, MissingRequirements, Requirements, CategoryMissing } from '@/models/types';

export const getDepartments = (courses: Course[]): string[] => {
  const departments = new Set<string>();
  courses.forEach(course => {
    departments.add(course.department);
  });
  return Array.from(departments).sort();
};

export const getDepartmentCourses = (courses: Course[], department: string): Course[] => {
  return courses.filter(course => course.department === department);
};

export const getCourseById = (courses: Course[], courseId: string): Course | undefined => {
  return courses.find(course => course.course_id === courseId);
};

export const parseCsvToJson = (csvContent: string): Course[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  
  return lines.slice(1)
    .map(line => {
      const values = line.split(',').map(value => value.trim());
      const course: any = {};
      
      headers.forEach((header, index) => {
        // Map common column names
        const columnMappings: { [key: string]: string } = {
          'subject': 'code',
          'catalog': 'code',
          'course': 'code',
          'name': 'title',
          'course name': 'title',
          'section': 'no',
          'class number': 'no',
          'schedule type': 'schd',
          'status': 'stat',
          'meeting time': 'meets',
          'room': 'location'
        };
        
        const mappedHeader = columnMappings[header] || header;
        course[mappedHeader] = values[index] || '';
      });
      
      // Process course code
      const courseCode = course.code || 
        (course.subject && course.catalog ? `${course.subject}-${course.catalog}` : '');
      
      return {
        course_id: courseCode.trim(),
        course_name: course.title?.trim() || '',
        title: course.title?.trim() || '',
        description: course.description || '',
        credits: 4, // Default to 4 credits as per Python implementation
        department: courseCode.split('-')[0] || '',
        section: course.no?.trim() || '',
        schd: course.schd?.trim() || '',
        stat: course.stat?.trim() || '',
        meets: course.meets?.trim() || '',
        instructor: course.instructor?.trim() || '',
        location: course.location?.trim() || '',
        capacity: parseInt(course.capacity?.replace(',', '') || '0') || 30,
        enrolled: parseInt(course.enrolled?.replace(',', '') || '0') || 0,
        prerequisites: [],
        days: parseMeetingDays(course.meets || ''),
        start_time: parseMeetingTime(course.meets || '')[0],
        end_time: parseMeetingTime(course.meets || '')[1]
      } as Course;
    })
    .filter(course => course.course_id && course.course_name);
};

const parseMeetingDays = (meets: string): string[] => {
  const daysPattern = /(MON|TUE|WED|THU|FRI|M|T|W|R|F)+/i;
  const match = meets.toUpperCase().match(daysPattern);
  return match ? [match[0]] : [];
};

const parseMeetingTime = (meets: string): [string, string] => {
  const timePattern = /(\d{1,2}:\d{2}(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}(?:AM|PM)?)/i;
  const match = meets.match(timePattern);
  return match ? [match[1], match[2]] : ['', ''];
};

export const getRecommendedCourses = (courses: Course[], interests: string, completedCourses: Set<string>): Recommendation[] => {
  if (!interests) return [];

  const interestsLower = interests.toLowerCase();
  const interestKeywords = new Set(interestsLower.split(' '));
  
  const recommendations = courses
    .filter(course => !completedCourses.has(course.course_id))
    .map(course => {
      let score = 0;
      const courseText = `${course.course_name} ${course.department}`.toLowerCase();
      
      interestKeywords.forEach(keyword => {
        if (courseText.includes(keyword)) score++;
      });
      
      return {
        course_id: course.course_id,
        title: course.course_name,
        description: course.description,
        match_reason: `Matches ${score} of your interest keywords`,
        course: course,
        reason: `Matches ${score} of your interest keywords`,
        score
      } as Recommendation;
    })
    .filter(rec => rec.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return recommendations;
};

export const defaultRequirements: Requirements = {
  required_courses: [
    "MATH-UB 121",
    "MULT-UB 100",
    "CORE-UA 400",
    "CORE-UA 500",
    "ECON-UB 1",
    "ECON-UB 2",
    "STAT-UB 103",
    "STAT-UB 18"
  ],
  credits_required: 128,
  notes: "Consult the NYU Bulletin for detailed requirements.",
  electives_required: 64,
  courses: [],
  by_category: {
    "Liberal Arts Core": {
      required_courses: [
        "MATH-UB 121",
        "MULT-UB 100",
        "CORE-UA 400",
        "CORE-UA 500"
      ],
      credits_required: 16,
      electives_required: 0
    },
    "Business Tools": {
      required_courses: [
        "ECON-UB 1",
        "ECON-UB 2",
        "STAT-UB 103",
        "STAT-UB 18",
        "STAT-UB 3",
        "ACCT-UB 1"
      ],
      credits_required: 18,
      notes: "Choose either ECON-UB 1 or ECON-UB 2; STAT-UB 103 or (STAT-UB 18 & STAT-UB 3)",
      electives_required: 0
    },
    "Social Impact Core": {
      required_courses: [
        "SOMI-UB 65",
        "SOMI-UB 6",
        "SOMI-UB 12S"
      ],
      credits_required: 14,
      electives_required: 0
    }
  }
};

export const getMissingRequirements = (completedCourses: Set<string>): MissingRequirements => {
  const allRequiredCourses = new Set(defaultRequirements.required_courses);
  const missingRequirements: MissingRequirements = {
    required_courses: Array.from(allRequiredCourses).filter(course => !completedCourses.has(course)),
    by_category: {}
  };

  Object.entries(defaultRequirements.by_category).forEach(([category, requirements]) => {
    const categoryCourses = new Set(requirements.required_courses);
    const missingCourses = Array.from(categoryCourses).filter(course => !completedCourses.has(course));

    if (missingCourses.length > 0) {
      missingRequirements.by_category[category] = {
        missing: missingCourses,
        credits_required: requirements.credits_required,
        notes: requirements.notes,
        electives_required: requirements.electives_required || 0
      };
    }
  });

  return missingRequirements;
};
