import { Course, Recommendation, MissingRequirements, Requirements, CategoryMissing } from '@/models/types';

export const getDepartments = (courses: Course[]): string[] => {
  const departments = new Set<string>();
  courses.forEach(course => {
    departments.add(course.department);
  });
  return Array.from(departments);
};

export const getDepartmentCourses = (courses: Course[], department: string): Course[] => {
  return courses.filter((course) => {
    if (typeof course === 'object' && course.department === department) {
      // Ensure all required properties are present
      return {
        ...course,
        title: course.course_name, // Add missing title property
      };
    }
    return false;
  });
};

export const getCourseById = (courses: Course[], courseId: string): Course | undefined => {
  return courses.find(course => course.course_id === courseId);
};

export const getRecommendedCourses = (courses: Course[], interests: string, completedCourses: Set<string>): Recommendation[] => {
  const keywords = interests.toLowerCase().split(' ');

  return courses.reduce((recommendations: Recommendation[], course: Course) => {
    if (completedCourses.has(course.course_id)) {
      return recommendations;
    }

    let matchCount = 0;
    keywords.forEach(keyword => {
      if (course.title.toLowerCase().includes(keyword) || course.description.toLowerCase().includes(keyword)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      recommendations.push({
        course_id: course.course_id,
        title: course.title,
        description: course.description,
        match_reason: `Matched ${matchCount} keywords: ${keywords.join(', ')}`,
        course: course,
        reason: `Matched ${matchCount} keywords: ${keywords.join(', ')}`,
        score: matchCount,
      });
    }

    return recommendations;
  }, []).sort((a, b) => b.score - a.score);
};

// Mock function to simulate fetching degree requirements
export const getMissingRequirements = (completedCourses: Set<string>): MissingRequirements => {
  // Mock data for degree requirements
  const degreeRequirements: Requirements = {
    required_courses: ['CORE-UA 400', 'MATH-UA 121', 'CSC-UA 101'],
    credits_required: 128,
    notes: 'Consult the NYU Bulletin for detailed requirements.',
    electives_required: 64,
    courses: [],
    by_category: {
      'Math': {
        required_courses: ['MATH-UA 121', 'MATH-UA 122'],
        credits_required: 8,
        electives_required: 0,
      },
      'Science': {
        required_courses: ['CHEM-UA 125', 'PHYS-UA 121'],
        credits_required: 8,
        electives_required: 0,
      },
      'Core': {
        required_courses: ['CORE-UA 400'],
        credits_required: 4,
        electives_required: 0,
      }
    }
  };

  let missingRequiredCourses: string[] = degreeRequirements.required_courses.filter(course => !completedCourses.has(course));

  let missingByCategory: Record<string, CategoryMissing> = {};
  for (const category in degreeRequirements.by_category) {
    const requirement = degreeRequirements.by_category[category];
    const missingCourses = requirement.required_courses.filter(course => !completedCourses.has(course));
    missingByCategory[category] = {
      missing: missingCourses,
      credits_required: requirement.credits_required,
      electives_required: requirement.electives_required,
      notes: requirement.notes,
    };
  }

  return {
    required_courses: missingRequiredCourses,
    by_category: missingByCategory,
  };
};
