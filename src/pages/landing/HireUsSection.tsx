// src/pages/landing/HireUsSection.tsx
//
// "Hire Us" section of the landing page (id="hire-us", the target of the
// navbar's Hire Us link): organizations can request the Hub's services.

import React, { useState } from "react";
import HireUsModal from "../../components/HireUsModal";
import Section from "../../components/layout/Section";

const SERVICES = [
  {
    title: "Web and mobile apps",
    text: "Custom software designed, built and shipped by Hub developers.",
  },
  {
    title: "Systems and automation",
    text: "Internal tools and integrations that remove manual work.",
  },
  {
    title: "Security and quality",
    text: "Reviews, testing and hardening for software you already run.",
  },
];

const HireUsSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Section
      id="hire-us"
      label="Hire Us"
      title="Hire the Hub"
      description="Organizations can request the Hub's services. Tell us what you need and we will get back to you."
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border-2 border-primary px-8 py-3 text-base font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Request our services
        </button>
      }
    >
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <li
            key={service.title}
            className="rounded-2xl border border-line bg-surface-muted p-6"
          >
            <h3>{service.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{service.text}</p>
          </li>
        ))}
      </ul>
      <HireUsModal isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
};

export default HireUsSection;
