// src/types/member.types.ts

// The backend validates a member "role" against this fixed set of
// specializations — anything else is rejected with a 400.
export const MEMBER_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Database Specialist",
  "Cybersecurity Specialist",
  "Network Administrator",
  "DevOps Engineer",
  "Mobile Developer",
  "UI/UX Designer",
  "Other",
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export interface SkillDetail {
  name: string;
  percent: number;
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  overall: number;
  skills: SkillDetail[];
}

export interface Education {
  degree: string;
  institution: string;
  description: string;
  imageUrl: string;
  department?: string;
  startYear?: number;
  endYear?: number | null;
  status?: string;
}

// `telegram` was retired in favor of `instagram` on the backend (see
// toPublicContacts in member.controller.ts) - it's permanently stripped from
// every API response now, so it's deliberately not a field here. Adding it
// back would silently resurrect the exact bug this type once had: a value a
// member enters just vanishes on next load since the API never returns it.
export interface Contacts {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  portfolio?: string;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string;
  education: Education | null;
  contacts: Contacts | null;
  skillDetails: SkillDetail[];
  skillCategories?: SkillCategory[];
  skills: string[];
  hashtags?: string[];
  resumeUrl?: string | null;
  cvUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberResponse {
  status: string;
  data: {
    member: Member;
  };
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateMemberPayload {
  name: string;
  role: string;
  bio?: string;
  image?: File | null;
}

export interface UpdateMemberPayload {
  name?: string;
  role?: string;
  bio?: string;
  image?: File | null;
}

export interface ContactsPayload {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  portfolio?: string;
}

export interface EducationPayload {
  degree?: string;
  institution?: string;
  description?: string;
  educationImage?: File | null;
}

export interface SkillsPayload {
  skillDetails: SkillDetail[];
}
