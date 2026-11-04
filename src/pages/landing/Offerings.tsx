// src/pages/landing/Offerings.tsx
//
// A quick, scannable "what you get here" row right after the Hero -
// inspired by klab.rw's homepage, which leads with four core-offering
// cards before its longer About section. Ours covers what NPC Innovation
// Hub members actually do (matches WhyHub's practice areas + the Hub's
// mentorship/community focus), not a copy of kLab's own offerings.
import { Code2, Users, ShieldCheck, Handshake } from "lucide-react";

const OFFERINGS = [
  {
    title: "Hands-on Projects",
    icon: Code2,
    description:
      "Build real, working software for the National Police College, from idea to deployment.",
  },
  {
    title: "Mentorship",
    icon: Users,
    description:
      "Learn from experienced members and grow your skills through hands-on guidance.",
  },
  {
    title: "Cybersecurity Training",
    icon: ShieldCheck,
    description:
      "Develop practical skills in securing systems and protecting institutional data.",
  },
  {
    title: "Community & Collaboration",
    icon: Handshake,
    description:
      "Join a community of student developers, designers, and innovators.",
  },
];

const Offerings = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OFFERINGS.map(({ title, icon: Icon, description }) => (
            <div
              key={title}
              className="rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-primary/40 transition-all duration-200"
            >
              <Icon className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-primary mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offerings;
