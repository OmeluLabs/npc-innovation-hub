// src/pages/landing/ApplySection.tsx
//
// "Applications" section of the landing page (id="apply", the target of the
// navbar's Applications link). Accounts are invitation-only: people apply
// here and an admin's acceptance creates the account.

import React, { useState } from "react";
import JoinUsModal from "../../components/JoinUsModal";
import Section from "../../components/layout/Section";

const STEPS = [
  {
    title: "Apply",
    text: "Tell us about yourself, your skills and why you want to join.",
  },
  {
    title: "Review",
    text: "The Hub team reviews every application and may reach out.",
  },
  {
    title: "Join",
    text: "If accepted, your account details are sent to you by email.",
  },
];

const ApplySection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Section
      id="apply"
      label="Applications"
      title="Apply to join the Hub"
      description="Membership is by application. Join a community of student developers building real software."
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Start your application
        </button>
      }
    >
      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-2xl border border-line bg-white p-6 shadow-soft"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      <JoinUsModal isOpen={open} onClose={() => setOpen(false)} />
    </Section>
  );
};

export default ApplySection;
