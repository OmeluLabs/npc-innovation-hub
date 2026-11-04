// src/pages/Hub-info/StrategicObjectives.tsx
//
// The Hub's roadmap, numbered because it genuinely is a sequence of
// commitments the Hub is working through, not decoration. Shown directly on
// both Home's about section and /Hub-information - no gating, no separate
// "learn more" click needed to see it.
import { Compass } from "lucide-react";

const OBJECTIVES = [
  "Provide world-class infrastructure and resources for tech innovation and skill-building.",
  "Foster a collaborative ecosystem connecting student developers, mentors, and industry experts.",
  "Deliver high-quality training programs in software development, cybersecurity, and problem-solving.",
  "Support member projects from idea to a working, demoable product through mentorship and resources.",
  "Build partnerships within the National Police College and the wider tech community to expand opportunities for members.",
  "Contribute to the National Police College's position as a leader in technology-driven institutional innovation.",
];

const StrategicObjectives = () => {
  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Compass
            className="w-10 h-10 text-primary mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Strategic Objectives
          </h2>
          <p className="text-lg text-ink-muted/80 max-w-2xl mx-auto">
            Our roadmap to building a sustainable, impactful innovation culture
            at NPC.
          </p>
        </div>

        <ol className="space-y-6">
          {OBJECTIVES.map((objective, index) => (
            <li key={index} className="flex items-start gap-5">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-ink-muted text-lg pt-1.5">{objective}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default StrategicObjectives;
