// src/api/admin/memberLeadership.api.ts
//
// Admin-only: decides where a member appears on the public Members page
// (Co-Founders, Leaders or Members), with an optional display title and order.

import apiClient, { handleApiError } from "../client";
import { MEMBER_LEADERSHIP_ROUTES } from "../routes";
import type { LeadershipTier } from "../member/member.api";

export interface LeadershipPayload {
  leadershipTier: LeadershipTier;
  leadershipTitle?: string;
  displayOrder?: number;
}

export const updateMemberLeadership = async (
  memberId: string,
  payload: LeadershipPayload,
): Promise<void> => {
  try {
    await apiClient.patch(
      MEMBER_LEADERSHIP_ROUTES.UPDATE_LEADERSHIP(memberId),
      payload,
    );
  } catch (error) {
    throw new Error(`Failed to update leadership: ${handleApiError(error)}`);
  }
};
