function LatestPro() {
  return (
    // Same bare m-12 (48px, all sides, unconditional) bug already fixed
    // in services.tsx on this same page - 96px lost to margin alone
    // before any padding/content on a 320px phone.
    <section className="px-4 py-12 md:m-12">
      <div className="max-w-6xl mx-auto">
        {" "}
        {/* Changed from max-w-5xl to max-w-6xl */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">
          Our Latest Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative w-full h-[400px] rounded-xl shadow-lg overflow-hidden border border-secondary">
            {/* Background Image */}
            <img
              src="/assets/images/hero.png"
              alt="Work Image 1"
              className="absolute w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Content container */}
            <div className="relative h-full flex flex-col justify-end p-6">
              {/* Project Name - Increased bottom margin */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                Music Festival
              </h2>

              {/* Short Description - Removed negative margin */}
              <p className="text-white/90 text-lg mb-3 max-w-[80%]">
                Annual summer event featuring top artists and immersive
                experiences
              </p>

              {/* Profile and Button row */}
              <div className="flex justify-between items-end">
                {/* Profile section */}
                <div className="flex items-center">
                  <img
                    src="/assets/images/hero.png"
                    alt="Event Manager"
                    className="w-8 h-8 rounded-full border-2 border-white mr-2"
                  />
                  <span className="text-white font-medium text-sm md:text-base">
                    Event Productions
                  </span>
                </div>

                {/* View More Button */}
                <button className="bg-white text-secondary font-semibold px-5 py-2 rounded-full hover:bg-surface-muted transition-all shadow-md">
                  View More
                </button>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[400px] rounded-xl shadow-lg overflow-hidden border border-secondary">
            {/* Background Image */}
            <img
              src="/assets/images/hero.png"
              alt="Work Image 1"
              className="absolute w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Content container */}
            <div className="relative h-full flex flex-col justify-end p-6">
              {/* Project Name - Increased bottom margin */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                Music Festival
              </h2>

              {/* Short Description - Removed negative margin */}
              <p className="text-white/90 text-lg mb-3 max-w-[80%]">
                Annual summer event featuring top artists and immersive
                experiences
              </p>

              {/* Profile and Button row */}
              <div className="flex justify-between items-end">
                {/* Profile section */}
                <div className="flex items-center">
                  <img
                    src="/assets/images/hero.png"
                    alt="Event Manager"
                    className="w-8 h-8 rounded-full border-2 border-white mr-2"
                  />
                  <span className="text-white font-medium text-sm md:text-base">
                    Event Productions
                  </span>
                </div>

                {/* View More Button */}
                <button className="bg-white text-secondary font-semibold px-5 py-2 rounded-full hover:bg-surface-muted transition-all shadow-md">
                  View More
                </button>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[400px] rounded-xl shadow-lg overflow-hidden border border-secondary">
            {/* Background Image */}
            <img
              src="/assets/images/hero.png"
              alt="Work Image 1"
              className="absolute w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Content container */}
            <div className="relative h-full flex flex-col justify-end p-6">
              {/* Project Name - Increased bottom margin */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                Music Festival
              </h2>

              {/* Short Description - Removed negative margin */}
              <p className="text-white/90 text-lg mb-3 max-w-[80%]">
                Annual summer event featuring top artists and immersive
                experiences
              </p>

              {/* Profile and Button row */}
              <div className="flex justify-between items-end">
                {/* Profile section */}
                <div className="flex items-center">
                  <img
                    src="/assets/images/hero.png"
                    alt="Event Manager"
                    className="w-8 h-8 rounded-full border-2 border-white mr-2"
                  />
                  <span className="text-white font-medium text-sm md:text-base">
                    Event Productions
                  </span>
                </div>

                {/* View More Button */}
                <button className="bg-white text-secondary font-semibold px-5 py-2 rounded-full hover:bg-surface-muted transition-all shadow-md">
                  View More
                </button>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[400px] rounded-xl shadow-lg overflow-hidden border border-secondary">
            {/* Background Image */}
            <img
              src="/assets/images/hero.png"
              alt="Work Image 1"
              className="absolute w-full h-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Content container */}
            <div className="relative h-full flex flex-col justify-end p-6">
              {/* Project Name - Increased bottom margin */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                Music Festival
              </h2>

              {/* Short Description - Removed negative margin */}
              <p className="text-white/90 text-lg mb-3 max-w-[80%]">
                Annual summer event featuring top artists and immersive
                experiences
              </p>

              {/* Profile and Button row */}
              <div className="flex justify-between items-end">
                {/* Profile section */}
                <div className="flex items-center">
                  <img
                    src="/assets/images/hero.png"
                    alt="Event Manager"
                    className="w-8 h-8 rounded-full border-2 border-white mr-2"
                  />
                  <span className="text-white font-medium text-sm md:text-base">
                    Event Productions
                  </span>
                </div>

                {/* View More Button */}
                <button className="bg-white text-secondary font-semibold px-5 py-2 rounded-full hover:bg-surface-muted transition-all shadow-md">
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestPro;
