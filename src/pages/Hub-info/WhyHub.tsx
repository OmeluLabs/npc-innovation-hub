// src/pages/Hub-info/WhyHub.tsx
//
// What the Hub's three practice areas actually do, in our own words - not
// the generic freelance-agency copy this used to carry (previously read
// like any software vendor's site, no mention of the College at all). The
// old "TRUSTED BY" strip of five unlabeled logo images is gone too - it
// implied real partnerships that were never confirmed.
import { ShieldCheck, LayoutTemplate, Server } from "lucide-react";

const PRACTICE_AREAS = [
  {
    title: "Cybersecurity",
    icon: ShieldCheck,
    tagline: "Protecting our institution's digital systems.",
    description:
      "Our cybersecurity members learn to identify and defend against real threats, building the practical skills needed to keep the National Police College's data and systems secure.",
  },
  {
    title: "Front-End Development",
    icon: LayoutTemplate,
    tagline: "Building interfaces our institution can rely on.",
    description:
      "We design and build user-friendly, accessible interfaces for the tools and platforms the Hub ships, turning ideas into interactive experiences that work for everyone who uses them.",
  },
  {
    title: "Back-End Development",
    icon: Server,
    tagline: "Powering our institution's applications.",
    description:
      "We build the databases, APIs, and server-side systems behind the Hub's projects, focused on reliability and data security for the College's real, day-to-day needs.",
  },
];

const WhyHub = () => {
  return (
    // p-14 (56px) was unconditional on every side - 112px gone to
    // horizontal padding alone on a 320px phone. Keeps the same vertical
    // rhythm (py-14 doesn't cost width) and restores the full padding at
    // md: where it doesn't compete with content for room.
    <div className="bg-green-50 px-4 py-14 md:p-14">
      <div className="max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8 text-primary text-center py-6">
          Why NPC Innovation Hub?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map(({ title, icon: Icon, tagline, description }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-sm border border-line p-6 min-h-[280px] flex flex-col"
            >
              <Icon className="w-9 h-9 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {title}
              </h3>
              <p className="italic mb-3 text-ink-muted">{tagline}</p>
              <p className="text-ink-muted flex-grow">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyHub;
