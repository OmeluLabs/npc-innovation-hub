// src/pages/Hub-info/MissionSection.tsx
//
// Mission / Vision / Goals cards - shown directly, no "learn more" gate.
// Used on both Home's about section and /Hub-information, same content
// both places.
import { Target, Eye, Flag } from "lucide-react";

const CARDS = [
  {
    title: "MISSION",
    icon: Target,
    points: [
      "We empower student innovators through a collaborative ecosystem built on technology, mentorship, and hands-on skill development.",
      "Our work accelerates the National Police College's digital transformation and strengthens its institutional capacity.",
    ],
  },
  {
    title: "VISION",
    icon: Eye,
    points: [
      "To establish the National Police College as a leading hub for technology excellence and sustainable innovation, empowering students to pioneer practical, technology-driven solutions to modern security and societal challenges.",
    ],
  },
  {
    title: "GOALS",
    icon: Flag,
    points: [
      "We aim to deliver high-quality, secure software that serves the National Police College's needs, enhancing user satisfaction.",
      "Our focus is on innovation, efficiency, and fostering a culture of learning.",
    ],
  },
];

const HubInfo = () => {
  return (
    <div>
      {/* Main Content. p-14 (56px) was unconditional - scaled down for
          mobile, restored at md: */}
      <div className="max-w-6xl mx-auto px-4 py-14 md:p-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map(({ title, icon: Icon, points }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="bg-primary px-6 py-6 flex items-center justify-center gap-2">
                <Icon
                  className="w-6 h-6 text-white flex-shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-2xl font-semibold text-white text-center">
                  {title}
                </h2>
              </div>
              <div className="p-6 md:p-12">
                <ul className="space-y-4">
                  {points.map((point) => (
                    <li key={point} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                      <p className="text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubInfo;
