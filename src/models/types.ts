
export interface Course {
  key: string;
  course_id: string;
  course_name: string;
  credits: number;
  department: string;
  section: string;
  schd: string;
  stat: string;
  meets: string;
  instructor: string;
  location: string;
  capacity: number;
  enrolled: number;
  days?: string;
  start_time?: string;
  end_time?: string;
}

export interface Recommendation {
  course: Course;
  score: number;
  reason: string;
}

export interface CategoryRequirement {
  required_courses: string[];
  credits_required: number;
  electives_required?: number;
  notes?: string;
}

export interface CategoryMissing {
  courses: Set<string>;
  credits_required: number;
  notes: string;
  electives_required: number;
}

export interface Requirements {
  required_courses: Set<string>;
  by_category: Record<string, CategoryRequirement>;
  total_credits_needed: number;
}

export interface MissingRequirements {
  required_courses: Set<string>;
  by_category: Record<string, CategoryMissing>;
}
