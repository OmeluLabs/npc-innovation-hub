// src/components/AuthPageMain.tsx
//
// The shared page frame for every auth page (Login, Sign Up, OTP
// Verification, Forgot Password). Previously each page had its own
// hand-rolled copy of a two-column layout - a plain, strongly-gradiented
// photo on the left and a separately-tinted copy of the same photo behind
// the form on the right, visually two different backgrounds stitched
// together rather than one. Now it's a single hubimage.jpg + navy-tint
// backdrop behind the whole row, with the feature highlights and the form
// (passed as children) both floating on top of it as one consistent
// surface - the two-sided look is gone, by construction, everywhere this
// is used.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Lightbulb, Users } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Rocket,
    title: "Innovate Together",
    text: "Collaborate with like-minded creators",
  },
  {
    icon: Lightbulb,
    title: "Create Solutions",
    text: "Build projects that make a difference",
  },
  {
    icon: Users,
    title: "Lead Communities",
    text: "Inspire and guide fellow innovators",
  },
];

export default function AuthPageMain({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden"
    >
      {/* One shared background for the entire row - photo + navy tint,
          decorative (aria-hidden), behind both the feature highlights and
          the form. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hubimage.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-primary/55" aria-hidden="true" />

      {/* Feature highlights - only at md+, where there's room to read them;
          below that it's just the shared backdrop behind the form.
          items-start (not center) so this column's top lines up with the
          form column's top - both use the same p-8 lg:p-12, and the form
          column matches with items-start of its own at md+. Plain text
          with a drop-shadow for contrast, not cards - large, bold type is
          the visual weight now instead of a translucent box behind it. */}
      <div className="hidden md:flex relative z-10 md:w-1/2 items-start p-8 lg:p-12">
        <div className="w-full">
          {/* No max-w-md cap here (unlike the feature list below) and
              whitespace-nowrap - this needs the column's full padded width
              to stay on one line at this size instead of wrapping. */}
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight whitespace-nowrap text-white drop-shadow-lg mb-10">
            Innovate. Create. Build.
          </h2>

          <div className="max-w-md space-y-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold drop-shadow-md">
                    {title}
                  </h3>
                  <p className="text-ink-muted drop-shadow-md">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form column - content passed in per page. overflow-y-auto is a
          fallback that lets this column scroll on its own on an unusually
          short viewport. items-start at md+ (matching padding to the
          feature column) so the form card's top lines up with the tagline
          above instead of floating centered at a different height; stays
          centered below md, where the feature column isn't shown. */}
      <div className="relative z-10 flex-1 md:w-1/2 min-h-0 overflow-y-auto flex items-center md:items-start justify-center p-4 sm:p-8 md:p-8 lg:p-12">
        {children}
      </div>
    </main>
  );
}
