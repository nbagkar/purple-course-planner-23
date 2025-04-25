import { Course, Recommendation, Requirements, MissingRequirements } from '../models/types';

export const parseCsvToJson = (csvContent: string): Course[] => {
  const lines = csvContent.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  const courses: Course[] = [];
  
  // Map common column names to expected names
  const columnMappings: Record<string, string> = {
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
    'room': 'location',
    'enrollment': 'enrolled',
    'enrollment capacity': 'capacity'
  };
  
  // Find mapped header positions
  const headerMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const mappedHeader = columnMappings[header] || header;
    headerMap[mappedHeader] = index;
  });
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    
    // Parse course code
    let courseCode = getFieldValue(values, headerMap, 'code') || '';
    if (!courseCode) {
      const subject = getFieldValue(values, headerMap, 'subject') || '';
      const catalog = getFieldValue(values, headerMap, 'catalog') || '';
      if (subject && catalog) {
        courseCode = `${subject}-${catalog}`;
      }
    }
    
    const department = courseCode.split('-')[0] || '';
    
    // Create course object
    const course: Course = {
      key: getFieldValue(values, headerMap, 'key') || '',
      course_id: courseCode,
      course_name: getFieldValue(values, headerMap, 'title') || '',
      credits: 4, // Default to 4 credits
      department,
      section: getFieldValue(values, headerMap, 'no') || '',
      schd: getFieldValue(values, headerMap, 'schd') || '',
      stat: getFieldValue(values, headerMap, 'stat') || '',
      meets: getFieldValue(values, headerMap, 'meets') || '',
      instructor: getFieldValue(values, headerMap, 'instructor') || '',
      location: getFieldValue(values, headerMap, 'location') || '',
      capacity: parseInt(getFieldValue(values, headerMap, 'capacity') || '0', 10) || 0,
      enrolled: parseInt(getFieldValue(values, headerMap, 'enrolled') || '0', 10) || 0
    };
    
    // Parse meeting times
    if (course.meets) {
      // Handle days
      const daysPattern = /(MON|TUE|WED|THU|FRI|M|T|W|R|F)+/i;
      const daysMatch = course.meets.match(daysPattern);
      if (daysMatch) {
        course.days = daysMatch[0];
      }
      
      // Handle times
      const timePattern = /(\d{1,2}:\d{2}(?:AM|PM)?)\s*-\s*(\d{1,2}:\d{2}(?:AM|PM)?)/i;
      const timeMatch = course.meets.match(timePattern);
      if (timeMatch) {
        course.start_time = timeMatch[1];
        course.end_time = timeMatch[2];
      }
    }
    
    courses.push(course);
  }
  
  return courses;
};

const getFieldValue = (values: string[], headerMap: Record<string, number>, field: string): string => {
  const index = headerMap[field];
  return index !== undefined && index < values.length ? values[index].trim() : '';
};

export const getDepartments = (courses: Course[]): string[] => {
  const departments = new Set<string>();
  courses.forEach(course => {
    if (course.department) {
      departments.add(course.department);
    }
  });
  return Array.from(departments).sort();
};

export const getDepartmentCourses = (courses: Course[], department: string): Course[] => {
  return courses.filter(course => course.department === department);
};

export const getCourseById = (courses: Course[], courseId: string): Course | undefined => {
  return courses.find(course => course.course_id === courseId);
};

export const getRecommendedCourses = (
  courses: Course[],
  interests: string,
  completedCourses: Set<string>
): Recommendation[] => {
  if (!interests) return [];
  
  const interestsLower = interests.toLowerCase();
  const interestKeywords = new Set(interestsLower.split(/\s+/));
  const recommendations: Recommendation[] = [];
  
  courses.forEach(course => {
    if (!completedCourses.has(course.course_id)) {
      let score = 0;
      const courseText = `${course.course_name} ${course.department}`.toLowerCase();
      
      interestKeywords.forEach(keyword => {
        if (keyword && courseText.includes(keyword)) {
          score += 1;
        }
      });
      
      if (score > 0) {
        recommendations.push({
          course_id: course.course_id,
          title: course.course_name,
          description: course.description || '',
          match_reason: `Matches ${score} of your interest keywords`,
          course,
          reason: `Matches ${score} of your interest keywords`,
          score
        });
      }
    }
  });
  
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
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
    "STAT-UB 18",
    "STAT-UB 3",
    "ACCT-UB 1",
    "SOMI-UB 65",
    "SOMI-UB 6",
    "SOMI-UB 12S",
    "ACCT-UB 4",
    "FINC-UB 2",
    "MGMT-UB 1",
    "MKTG-UB 1",
    "OPMG-UB 1",
    "MULT-UB 11",
    "BTEP-UB 1",
    "BTEP-UB 2",
    "BTEP-UB 3",
    "BTEP-UB 4",
    "CSC-UB 101",
    "CSC-UB 102"
  ],
  by_category: {
    "Liberal Arts Core": {
      required_courses: [
        "MATH-UB 121",
        "MULT-UB 100",
        "CORE-UA 400",
        "CORE-UA 500"
      ],
      credits_required: 16
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
      notes: "Choose either ECON-UB 1 or ECON-UB 2; STAT-UB 103 or (STAT-UB 18 & STAT-UB 3)"
    },
    "Social Impact Core": {
      required_courses: [
        "SOMI-UB 65",
        "SOMI-UB 6",
        "SOMI-UB 12S"
      ],
      credits_required: 14
    },
    "Functional Business Core": {
      required_courses: [
        "ACCT-UB 4",
        "FINC-UB 2",
        "MGMT-UB 1",
        "MKTG-UB 1",
        "OPMG-UB 1",
        "MULT-UB 11"
      ],
      credits_required: 12
    },
    "Entrepreneurship Core": {
      required_courses: [
        "BTEP-UB 1",
        "BTEP-UB 2"
      ],
      credits_required: 13,
      notes: "Must complete Startup Lab (3cr) and NYC Entrepreneurship Lab (3cr)",
      electives_required: 1
    },
    "Technology Core": {
      required_courses: [
        "BTEP-UB 3",
        "BTEP-UB 4",
        "CSC-UB 101",
        "CSC-UB 102"
      ],
      credits_required: 15,
      electives_required: 1
    }
  },
  credits_required: 128,
  notes: "",
  electives_required: 0,
  courses: []
};

export const getMissingRequirements = (
  completedCourses: Set<string>
): MissingRequirements => {
  const missingRequiredCourses: string[] = [];
  defaultRequirements.required_courses.forEach(course => {
    if (!completedCourses.has(course)) {
      missingRequiredCourses.push(course);
    }
  });
  
  const missingByCategory: Record<string, CategoryMissing> = {};
  
  Object.entries(defaultRequirements.by_category).forEach(([category, reqs]) => {
    const missingCourses: string[] = [];
    
    reqs.required_courses.forEach(course => {
      if (!completedCourses.has(course)) {
        missingCourses.push(course);
      }
    });
    
    if (missingCourses.length > 0) {
      missingByCategory[category] = {
        missing: missingCourses,
        credits_required: reqs.credits_required,
        notes: reqs.notes,
        electives_required: reqs.electives_required
      };
    }
  });
  
  return {
    required_courses: missingRequiredCourses,
    by_category: missingByCategory
  };
};
