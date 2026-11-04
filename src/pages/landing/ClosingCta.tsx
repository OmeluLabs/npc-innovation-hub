// src/pages/landing/ClosingCta.tsx
//
// Closing call to action at the end of the landing page: join the Hub (apply)
// or hire the Hub (organizations requesting services).

import React from "react";
import { Link } from "react-router-dom";

const ClosingCta: React.FC = () => (
  <section
    id="get-involved"
    aria-label="Get involved"
    className="bg-primary py-16 lg:py-20"
  >
    <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
      <h2 className="text-white">Build the next idea with us</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
        Students can apply to join the Hub and grow through real projects.
        Organizations can hire the Hub to design and build software for them.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/apply"
          className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary transition-colors duration-200 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          Join the Hub
        </Link>
        <Link
          to="/hire-us"
          className="rounded-lg border-2 border-white/80 px-8 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          Hire Us
        </Link>
      </div>
    </div>
  </section>
);

export default ClosingCta;
