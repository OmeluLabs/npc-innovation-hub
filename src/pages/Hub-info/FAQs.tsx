// src/pages/Hub-info/FAQs.tsx
//
// Previously shipped with 3 of 4 questions carrying an empty answer,
// rendering "Answer coming soon" in production - filled in with real,
// complete answers instead. Reachable from the Footer's Support column
// (see Footer.tsx) rather than being buried mid-page on /Hub-information.
import { HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What does the Innovation Hub specialize in?",
      answer:
        "We specialize in full-stack development, creating complete web and mobile applications from front-end to back-end. We also integrate cybersecurity practices into our development process to ensure secure and reliable digital solutions for the National Police College.",
    },
    {
      question: "How does the Innovation Hub ensure security in its projects?",
      answer:
        "Security is built into our process, not added afterward. Our cybersecurity members review projects for common vulnerabilities, we follow secure coding practices, and sensitive data is handled with the same care the College's own systems require.",
    },
    {
      question: "What technologies do you use in full-stack development?",
      answer:
        "Our stack centers on React and TypeScript on the front end, Node.js and Express on the back end, and PostgreSQL for data storage, the same technologies powering this platform itself.",
    },
    {
      question: "Can the Innovation Hub handle both design and deployment?",
      answer:
        "Yes. Member teams take a project from interface design through backend development to a deployed, working application, covering the full path from idea to something the College can actually use.",
    },
    {
      question: "Who can join NPC Innovation Hub?",
      answer:
        "Membership is open to National Police College students interested in technology, whether you're an experienced developer or just getting started. Applications are reviewed on a rolling basis.",
    },
    {
      question: "Is there a cost to join or use the Hub's resources?",
      answer:
        "No. NPC Innovation Hub is a student-led space within the College, and membership and access to its resources are free for College students.",
    },
  ];

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    // p-14 (56px) was unconditional - scaled down for mobile, restored
    // at md:
    <div className="bg-surface-muted px-4 py-14 md:p-14 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <HelpCircle
            className="w-10 h-10 text-primary mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleAnswer(index)}
                aria-expanded={activeIndex === index}
                className="w-full text-left flex justify-between items-center gap-4 focus:outline-none p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {faq.question}
                </h2>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transform transition-transform ${activeIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeIndex === index && (
                <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
