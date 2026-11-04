import { useState, useEffect } from "react";
import JoinUsModal from "../../components/JoinUsModal";
import {
  useHeroBackgroundCarousel,
  HeroBackgroundMediaLayers,
  HeroBackgroundDots,
} from "./HeroBackgroundMedia";

/**
 * HeroSection Component
 *
 * Production-ready hero section for NpcInnovationHub landing page
 * Matches reference design with pixel-perfect accuracy
 *
 * Features:
 * - Background photo (Hub students at work) at every breakpoint, under one
 *   uniform navy scrim (not a per-column split) so headline, paragraph
 *   and tagline all read the same regardless of what part of the photo
 *   sits behind them - klab.rw's own hero uses the same one-overlay-for-
 *   the-whole-image approach.
 *   Headline/paragraph/button/dots/tagline are white throughout, with a
 *   drop-shadow as insurance against the photo's own brightness.
 * - Responsive navigation with hamburger menu
 * - Single full-width text column over the photo (klab.rw-style, not a
 *   40/60 two-column split) - headline and paragraph wrap naturally into
 *   as many lines as their own length needs, rather than being squeezed
 *   into an artificially narrow side column. No member photos/roster
 *   here (that lives in its own homepage section further down, and its
 *   own full /members page).
 * - Fully accessible and mobile-responsive
 * - Rotates through 4 headline/subtext messages
 * - CTA row (Join Us + slide dots + the "Innovate. Create. Build."
 *   tagline) sits together on one line near the bottom of the hero
 *
 * Updates:
 * - Removed the team-member photo carousel that used to occupy a
 *   separate right column (name/role cards) - the Hub's members are
 *   presented in their own dedicated homepage section and /members page
 *   instead, not repeated inside the hero.
 * - Collapsed the two-column layout into one full-width column: the
 *   40%-wide text column was forcing every headline onto 3-4 cramped
 *   one-word lines regardless of how short the slide actually was. The
 *   tagline that used to live alone in the freed-up right column now
 *   sits in the CTA row instead, alongside Join Us and the slide dots.
 * - Extended the desktop-only photo/navy-overlay background and white
 *   text/button/dots/tagline treatment to every breakpoint, replacing the
 *   flat white + navy text mobile/tablet previously had, so the hero
 *   reads as one consistent identity regardless of device
 */

// Four angles on what the Hub actually offers - mentorship, real shipped
// projects, and the Hire Us career pipeline - rather than one
// static line repeating the same pitch forever.
const HERO_SLIDES = [
  {
    headline: "Empowering Developers, Driving Innovation.",
    text: "A student-led space for creating innovative, real-world tech solutions.",
  },
  {
    headline: "Where Students Become Builders.",
    text: "Join a community of student developers turning classroom ideas into real, working software - with mentorship every step of the way.",
  },
  {
    headline: "From First Line of Code to Finished Project.",
    text: "Ship real projects, build a portfolio that matters, and grow the skills employers are actually looking for.",
  },
  {
    headline: "Innovation With a Career Path.",
    text: "Learn alongside a growing network of builders, get discovered through Hire Us, and turn your Hub experience into your next opportunity.",
  },
];

const TEXT_SLIDE_INTERVAL_MS = 3000;
const FADE_DURATION_MS = 300;

const HeroSection = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [textSlide, setTextSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [textPaused, setTextPaused] = useState(false);

  const changeTextSlide = (index: number) => {
    setTextVisible(false);
    setTimeout(() => {
      setTextSlide(index);
      setTextVisible(true);
    }, FADE_DURATION_MS);
  };

  const nextTextSlide = () =>
    changeTextSlide((textSlide + 1) % HERO_SLIDES.length);

  // Re-arms on every slide change, whether that came from this timer or
  // a manual dot click - so jumping ahead doesn't get immediately
  // overridden by a tick that was already mid-countdown.
  useEffect(() => {
    if (textPaused) return undefined;
    const timer = setInterval(nextTextSlide, TEXT_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSlide, textPaused]);

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
      // No overflow-hidden here (there used to be one): per spec, if
      // overflow-x and overflow-y aren't both `visible`, the browser
      // forces BOTH to `auto` - so overflow-x-hidden alone (or paired
      // with an explicit overflow-y-visible) ends up clipping vertically
      // too, cutting off the background layer's -top-[71px] extension
      // below before it can reach up behind Navbar.tsx's transparent
      // header. Nothing else in this section actually overflows its box
      // (the background layer is inset-x-0-bounded horizontally), so
      // dropping this was the only way to let that one element bleed
      // upward without paying for it everywhere else.
      className="w-full min-h-screen bg-white relative flex flex-col scroll-mt-16 lg:scroll-mt-20"
    >
      <JoinUsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      {/* =================================================================
          BACKGROUND DESIGN - Photo, navy overlay (all breakpoints)
          A real photo of the Hub's own students at work, reusing the
          existing public/assets/images/hubimage.jpg (already shipped and
          used on the auth pages) rather than adding a second, much
          heavier copy of the same picture. Was lg-only, with mobile/
          tablet staying flat white instead (a full photo behind wrapping
          single-column text risked contrast problems wherever a line
          landed on the image's darker areas) - now shown at every
          breakpoint to match the desktop identity, with the overlay
          below doing more work at the breakpoints that need it to keep
          that promise.
          -top-[71px]/-top-[63px]: the fixed Navbar reserves its own
          height via a spacer div rendered ABOVE this section in the page
          (63px below lg, 71px at lg - measured, since the header's
          content row is intrinsic to the logo's size rather than a
          fixed h-16/h-20 - see Navbar.tsx), so this section's
          own top edge already starts below it - inset-0/top-0 would leave
          that reserved strip showing the plain white page background
          instead of this photo. Extending the top edge up by the navbar's
          own height at each breakpoint reaches into that reserved strip
          instead, without moving this section's box (bottom-0 keeps the
          bottom edge anchored) or the spacer's height (still reserves the
          same space for every OTHER route/state, so nothing else shifts).
          Needs overflow-x-hidden, not overflow-hidden, on the section
          above - overflow-hidden would clip this negative offset before
          it ever reaches up past the section's own top. */}
      <div className="absolute inset-x-0 bottom-0 -top-[63px] lg:-top-[71px] z-0">
        {/* Admin-controlled hero background (images and/or video) - see
            HeroBackgroundMedia.tsx. Renders the same static
            /assets/images/hubimage.jpg as before whenever no active media
            is configured or the fetch fails, so this can never regress to
            a blank hero. */}
        <HeroBackgroundMediaLayers
          activeMedia={heroBackgroundMedia}
          currentIndex={heroBackgroundIndex}
          reducedMotion={heroBackgroundReducedMotion}
          setHovered={setHeroBackgroundHovered}
          onError={handleHeroBackgroundMediaError}
        />
        {/* One uniform navy scrim over the whole photo, every breakpoint -
            not a left-light/right-dark split. A gradient that goes light
            wherever text happens to land leaves that text's contrast at
            the mercy of whatever's directly behind it in the photo (a
            bright laptop screen, a pale shirt); a single consistent tint
            guarantees every line - headline, paragraph, tagline - reads
            the same regardless of position, the same way klab.rw's own
            hero holds one dark overlay across its full image rather than
            varying it by column. Still translucent, not a solid fill -
            the photo stays visible underneath, just consistently dimmed. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,31,63,0.62) 0%, rgba(0,20,40,0.75) 100%)",
          }}
        />
      </div>
      {/* Background-carousel dot controls - deliberately a LATER sibling
          of the whole background wrapper above (not nested inside it), so
          plain DOM order paints them above both the media and the two
          gradient overlays without needing to fight z-index across
          separate stacking contexts. Renders nothing for the common
          single-image case. */}
      <HeroBackgroundDots
        activeMedia={heroBackgroundMedia}
        currentIndex={heroBackgroundIndex}
        onSelect={setHeroBackgroundIndex}
      />

      {/* =================================================================
          MAIN HERO CONTENT
          ================================================================= */}

      {/* A <div>, not <main> - this only covers the hero, not the rest of
          the page's content (About, Members, Projects, ...), which all
          render as later siblings in AllRoutes.tsx's "/" route. The single
          <main id="main-content"> that covers all of it lives there instead
          - see that file's comment for why.
          One full-width column, not a 40/60 split - klab.rw's own hero
          lets its headline use the whole viewport's width and just wraps
          onto however many lines its own length needs; a narrow side
          column was forcing every slide here onto 3-4 one-word lines
          regardless of how short the sentence actually was. pt-10 is just
          breathing room under the fixed navbar (which reserves its own
          space via its spacer div). */}
      <section
        className="flex-1 flex flex-col justify-center relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24 pt-10 sm:pt-12 pb-10 lg:pb-14 lg:pt-20"
        onMouseEnter={() => setTextPaused(true)}
        onMouseLeave={() => setTextPaused(false)}
      >
        {/* Rotating headline/subtext - fades out, swaps, fades back in.
            max-w caps line length for readability without artificially
            narrowing the column itself, so a short slide (e.g. "Where
            Students Become Builders.") sits on one line while a longer
            one (e.g. "From First Line of Code to Finished Project.")
            wraps to two - each at whatever length it actually needs,
            not a fixed one-word-per-line squeeze. min-h reserves the
            tallest of the 4 slides' actual rendered height at each
            breakpoint (measured directly, not guessed - headline
            line-count doesn't track paragraph line-count, so the
            "obviously longest" slide isn't the tallest one at every
            width) so the CTA row below never jumps up and down as the
            active slide changes. aria-live="polite" announces the
            change to screen readers without interrupting them
            mid-sentence, and pausing on hover/focus (see this section's
            own handlers and the buttons' onFocus below) keeps this from
            being content that auto-updates with no way to stop it. */}
        <div
          aria-live="polite"
          className={`max-w-3xl min-h-[9rem] sm:min-h-[8rem] md:min-h-[9rem] lg:min-h-[11rem] xl:min-h-[10rem] transition-opacity duration-300 ${
            textVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-white drop-shadow-lg font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 tracking-tight">
            {HERO_SLIDES[textSlide].headline}
          </h1>
          <p className="text-white/90 drop-shadow-md text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed max-w-2xl">
            {HERO_SLIDES[textSlide].text}
          </p>
        </div>

        {/* CTA row - Join Us, slide dots, and the tagline together on one
            line (was its own centered block in a separate right column;
            moved here now that column's gone). flex-wrap lets the
            tagline drop to its own line below the rest on narrow
            viewports rather than clipping or forcing a tiny font. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-6">
          {/* No border box at rest - plain text - but the original
              outlined-box hover (border appears, fills white, text
              flips navy) comes back on hover. border-2 border-transparent
              at rest (not just no border at all) so the box's size is
              already reserved and hovering doesn't shift surrounding
              layout when the border becomes visible. */}
          <button
            className="text-white border-2 border-transparent hover:border-white hover:bg-white hover:text-[#002B56] px-10 py-3 font-semibold text-lg lg:text-[1.2rem] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label="Join NpcInnovationHub"
            onClick={() => setIsJoinModalOpen(true)}
          >
            Join Us
          </button>

          {/* No prev/next arrows - dots are the only manual control,
              direct-jump is enough for 4 slides this short-lived (3s
              each). */}
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.headline}
                onClick={() => changeTextSlide(index)}
                onFocus={() => setTextPaused(true)}
                onBlur={() => setTextPaused(false)}
                aria-label={`Show message ${index + 1} of ${HERO_SLIDES.length}`}
                aria-current={index === textSlide}
                className={`rounded-full transition-all duration-300 ${
                  index === textSlide
                    ? "bg-white w-6 h-2"
                    : "bg-white/40 hover:bg-white/60 w-2 h-2"
                }`}
              />
            ))}
          </div>

          <p className="text-xl sm:text-2xl font-bold select-none leading-tight tracking-tight drop-shadow-lg whitespace-nowrap">
            <span className="text-white">Innovate.</span>{" "}
            <span className="text-white/90">Create.</span>{" "}
            <span className="text-white/80">Build.</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
