export type UserRole = "student" | "professional" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  title: string | null;
  country: string | null;
  bio: string | null;
  role: UserRole;
  specialist_area: "food_science" | "engineering" | "career" | null;
  is_verified: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: "food_science" | "engineering" | "career";
  is_answered: boolean;
  created_at: string;
  author?: Pick<Profile, "full_name" | "title" | "country" | "role">;
  answers?: Answer[];
  answer_count?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  is_accepted: boolean;
  upvote_count: number;
  created_at: string;
  author?: Pick<Profile, "full_name" | "title" | "country" | "is_verified">;
}

export interface MentorRequest {
  id: string;
  from_user_id: string;
  to_mentor_id: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}
