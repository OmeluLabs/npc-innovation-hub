// src/components/profile/ProfileEducation.tsx

import React from "react";
import { GraduationCap } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileEducationProps {
  member: Member | null;
}

const ProfileEducation: React.FC<ProfileEducationProps> = ({ member }) => {
  const edu = member?.education;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-line p-6">
      <h3 className="text-sm font-bold text-primary mb-5">Education</h3>

      {!edu?.degree ? (
        <div className="flex flex-col items-center py-8 text-ink-muted gap-2">
          <GraduationCap size={28} className="opacity-30" />
          <p className="text-sm">No education added yet.</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Logo */}
          <div
            className="w-14 h-14 rounded-xl overflow-hidden bg-surface-muted shrink-0
                          flex items-center justify-center border border-line"
          >
            {edu.imageUrl ? (
              <img
                src={edu.imageUrl}
                alt={edu.institution}
                className="w-full h-full object-contain"
              />
            ) : (
              <GraduationCap size={24} className="text-ink-muted" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-primary">{edu.degree}</h4>
            <p className="text-sm text-secondary font-semibold mt-0.5">
              {edu.institution}
            </p>
            {edu.description && (
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEducation;
