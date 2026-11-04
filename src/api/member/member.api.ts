// src/api/member/member.api.ts

import apiClient from "../client";
import type { Member, MemberResponse } from "../../types/member.types";

export const getMemberById = async (userId: string): Promise<Member> => {
  const response = await apiClient.get<MemberResponse>(
    `/api/members/${userId}`,
  );
  return response.data.data.member;
};

export type LeadershipTier = "Co-Founder" | "Leader" | "Member";

export interface PublicMemberContacts {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface PublicMemberSummary {
  id: string;
  userId: string;
  name: string;
  role: string;
  imageUrl?: string;
  techStack?: string[];
  tagline?: string;
  available?: boolean;
  /** Set by an admin; drives which tier the member appears in. */
  leadershipTier?: LeadershipTier;
  /** Optional title shown instead of the specialization, e.g. "Chief Technology Officer". */
  leadershipTitle?: string | null;
  displayOrder?: number;
  contacts?: PublicMemberContacts;
}

export interface PublicMembersPage {
  members: PublicMemberSummary[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
}

export const getPublicMembers = async (
  page: number,
  limit: number,
): Promise<PublicMembersPage> => {
  const response = await apiClient.get("/api/members", {
    params: { page, limit },
  });
  const body = response.data as {
    data?: {
      members?: PublicMemberSummary[];
      totalPages?: number;
      currentPage?: number;
      totalMembers?: number;
      pagination?: {
        totalPages?: number;
        currentPage?: number;
        total?: number;
      };
    };
    totalPages?: number;
  };
  const payload = body.data ?? {};
  const members = Array.isArray(payload.members) ? payload.members : [];

  return {
    members,
    totalPages:
      payload.totalPages ??
      payload.pagination?.totalPages ??
      body.totalPages ??
      1,
    currentPage: payload.currentPage ?? payload.pagination?.currentPage ?? page,
    totalMembers:
      payload.totalMembers ?? payload.pagination?.total ?? members.length,
  };
};

/** Every public member in one request, already ordered by tier then displayOrder. */
export const getAllPublicMembers = async (): Promise<PublicMemberSummary[]> => {
  const result = await getPublicMembers(1, 500);
  return result.members;
};
