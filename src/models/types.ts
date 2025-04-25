export interface Course {
  course_id: string;
  title: string;
  description: string;
  credits: number;
  department: string;
  level?: string;
  prerequisites?: string[];
  corequisites?: string[];
  exclusions?: string[];
  required_for?: string[];
  category?: string;
  course_name: string;
  meets: string;
  instructor?: string;
  location?: string;
  enrolled: number;
  capacity: number;
  days?: string[];
  start_time?: string;
  end_time?: string;
  section?: string;
  schd?: string;
  stat?: string;
}

export interface Recommendation {
  course_id: string;
  title: string;
  description: string;
  match_reason: string;
  course: Course;
  reason: string;
  score: number;
}

export interface Requirements {
  required_courses: string[];
  credits_required: number;
  notes: string;
  electives_required: number;
  courses: string[];
  by_category: Record<string, CategoryRequirement>;
}

export interface CategoryRequirement {
  required_courses: string[];
  credits_required: number;
  notes?: string;
  electives_required?: number;
}

export interface CategoryMissing {
  missing: string[];
  credits_required: number;
  notes?: string;
  electives_required?: number;
}

export interface MissingRequirements {
  required_courses: string[];
  by_category: Record<string, CategoryMissing>;
}
