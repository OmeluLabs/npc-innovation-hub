// src/pages/landing/HeroSection.tsx
//
// Landing hero: one headline, a short value proposition, and two calls to
// action (apply to join / see our projects). The background is the
// admin-managed hero media (images and/or video, see HeroBackgroundMedia.tsx),
// which falls back to the static Hub photo when nothing is configured, under
// one uniform brand-colour scrim so the text always reads clearly.

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  useHeroBackgroundCarousel,
  HeroBackgroundMediaLayers,
  HeroBackgroundDots,
} from "./HeroBackgroundMedia";

const HeroSection = () => {
  const {
    activeMedia: heroBackgroundMedia,
    currentIndex: heroBackgroundIndex,
    setCurrentIndex: setHeroBackgroundIndex,
    reducedMotion: heroBackgroundReducedMotion,
    setHovered: setHeroBackgroundHovered,
    handleMediaError: handleHeroBackgroundMediaError,
  } = useHeroBackgroundCarousel();

  return (
    <div
      id="home"
      // No overflow-hidden: the background layer below extends upward by the
      // navbar's height so the transparent header floats over the photo, and
      // overflow clipping would cut that off.
      className="relative flex min-h-[85vh] w-full scroll-mt-16 flex-col bg-primary lg:scroll-mt-20"
    >
      {/* Background media. -top-[63px] / lg:-top-[71px] reach up behind the
          fixed navbar (63px below lg, 71px at lg - see Navbar.tsx). */}
      <div className="absolute inset-x-0 bottom-0 -top-[63px] z-0 lg:-top-[71px]">
        <HeroBackgroundMediaLayers
          activeMedia={heroBackgroundMedia}
          currentIndex={heroBackgroundIndex}
          reducedMotion={heroBackgroundReducedMotion}
          setHovered={setHeroBackgroundHovered}
          onError={handleHeroBackgroundMediaError}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/80 to-primary/90"
        />
      </div>

      <HeroBackgroundDots
        activeMedia={heroBackgroundMedia}
        currentIndex={heroBackgroundIndex}
        onSelect={setHeroBackgroundIndex}
      />

      <section className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-16 pt-12 sm:px-8 lg:px-16 lg:pb-24 lg:pt-20 xl:px-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Innovate. Create. Build.
          </p>
          <h1 className="mt-4 text-white">
            Empowering developers, driving innovation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">
            A student-led space where developers turn classroom ideas into real,
            working software, with mentorship at every step.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-base font-semibold text-primary transition-colors duration-200 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Apply to join
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center rounded-lg border-2 border-white/80 px-7 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              See our projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
