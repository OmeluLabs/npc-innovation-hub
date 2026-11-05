// src/components/profile/ProfileSkills.tsx

import React from "react";
import { Code } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileSkillsProps {
  member: Member | null;
}

const BAR_COLORS = [
  "from-secondary to-secondary",
  "from-secondary to-secondary",
  "from-green-500 to-secondary",
  "from-orange-400 to-amber-500",
];

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ member }) => {
  const skills = member?.skillDetails ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-line p-6">
      <h3 className="text-sm font-bold text-primary mb-5">
        Skills & Technologies
      </h3>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-ink-muted gap-2">
          <Code size={28} className="opacity-30" />
          <p className="text-sm">No skills added yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {skills.map((skill, idx) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-primary">
                  {skill.name}
                </span>
                <span className="text-xs font-bold text-secondary">
                  {skill.percent}%
                </span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-2.5 mb-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${BAR_COLORS[idx % BAR_COLORS.length]}
                               transition-all duration-700`}
                  style={{ width: `${skill.percent}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-surface-muted text-ink-muted px-2.5 py-0.5
                               rounded-full font-medium border border-line"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;
