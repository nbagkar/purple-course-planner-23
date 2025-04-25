export interface Course {
  course_id: string;
  title: string;
  description: string;
  credits: number;
  department: string;
  level: string;
  prerequisites: string[];
  corequisites: string[];
  exclusions: string[];
  required_for: string[];
  category: string;
}

export interface Recommendation {
  course_id: string;
  title: string;
  description: string;
  match_reason: string;
}

export interface MissingRequirements {
  [category: string]: string[];
}

export interface CategoryMissing {
  category: string;
  missing: string[];
}
