// src/pages/Hub-info/CoreValues.tsx
//
// Shown directly on both Home's about section and /Hub-information - no
// gating, no separate "learn more" click needed to see it.
import { Lightbulb, Users, Building2, Handshake } from "lucide-react";

const VALUES = [
  {
    title: "Innovation First",
    icon: Lightbulb,
    description:
      "We champion creative thinking and breakthrough solutions to address real-world challenges.",
  },
  {
    title: "Community Driven",
    icon: Users,
    description:
      "Our strength lies in our vibrant community of student developers, designers, and innovators.",
  },
  {
    title: "Service to Our Institution",
    icon: Building2,
    // Swapped in place of kLab's "Entrepreneurship" value - the Hub exists
    // to serve the National Police College, not to launch businesses, so
    // that framing doesn't fit here.
    description:
      "We channel our skills, projects, and innovation toward strengthening the National Police College and supporting its mission.",
  },
  {
    title: "Collaboration",
    icon: Handshake,
    description:
      "We believe in the power of partnerships and knowledge sharing to drive collective growth.",
  },
];

const CoreValues = () => {
  return (
    <div className="bg-surface-muted py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-ink-muted/80 max-w-2xl mx-auto">
            These principles guide everything we do and define who we are as a
            Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ title, icon: Icon, description }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <Icon className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {title}
              </h3>
              <p className="text-ink-muted/80">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues;
