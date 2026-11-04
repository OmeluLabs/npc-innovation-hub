// src/pages/HireUs/FirstSection.tsx
//
// The /hire-us route's opening section. Previously had its own second
// navbar (Home/AboutHub/Members/Projects/Sign In, all href="#" - dead)
// duplicating the real <Navbar /> already rendered above it on that route,
// plus four random i.pravatar.cc placeholder headshots labeled "JD"/"AM"/
// "SK"/"TM" presented as if they were real team members. Both removed - a
// "More Info" button that did nothing now scrolls to the real inquiry
// form further down the page instead.
const InnovationHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-surface-muted font-sans">
      {/* A <div>, not <main> - this only covers this section, not the rest
          of /hire-us's content (Services, LatestPro, LetTalk), which render
          as later siblings in AllRoutes.tsx. The single
          <main id="main-content"> that covers all of it lives there. */}
      <div className="pt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center py-16 md:py-24">
            {/* Left Column - Text Content */}
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-32">
              <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight mb-2">
                Our Hire Us Process:
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-secondary">From Planning to</span>
                <br />
                <span className="text-primary">Deployment.</span>
              </h2>
              <p className="text-ink-muted text-xl mb-8 leading-relaxed max-w-md">
                We handle your project from planning to deployment with
                professional, end-to-end solutions.
              </p>

              <div className="flex items-center space-x-4 mb-8">
                <a
                  href="#hire-us-form"
                  style={{ backgroundColor: "rgb(var(--color-primary))" }}
                  className="text-white font-medium py-3 px-6 rounded-full text-sm transition duration-200 hover:brightness-110"
                >
                  Get Started
                </a>
                <a
                  href="/members"
                  className="text-ink-muted font-medium hover:underline"
                >
                  Meet the team
                </a>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/images/Group 69.png"
                alt="Innovation Hub Process"
                className="w-full max-w-xl h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationHub;
