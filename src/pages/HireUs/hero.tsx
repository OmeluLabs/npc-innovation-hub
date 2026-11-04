import { useEffect, useRef } from "react";

function HireUsHero() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const shadowsRef = useRef<HTMLSpanElement[]>([]);

  // Initialize ref arrays
  useEffect(() => {
    imagesRef.current = [];
    shadowsRef.current = [];
  }, []);

  // Generate custom border radii
  const generateBorderRadius = () => {
    const values = [];
    for (let i = 0; i < 11; i++) {
      const val1 = 50 + Math.random() * 50;
      const val2 = 50 + Math.random() * 50;
      const val3 = 50 + Math.random() * 50;
      const val4 = 50 + Math.random() * 50;
      values.push(`${val1}% ${val2}% ${val3}% ${val4}%`);
    }
    return values;
  };

  const borderRadiusValues = generateBorderRadius();

  // Animation definitions
  const getRandomAnimation = (index: number) => {
    const animations = [
      {
        keyframes: `
          @keyframes float${index} {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(${Math.random() * 10 - 5}deg); }
          }
        `,
        animation: `float${index} ${3 + Math.random() * 4}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes pulse${index} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `,
        animation: `pulse${index} ${4 + Math.random() * 3}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes wobble${index} {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }
        `,
        animation: `wobble${index} ${5 + Math.random() * 2}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes drift${index} {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
            50% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
            75% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
          }
        `,
        animation: `drift${index} ${6 + Math.random() * 4}s ease-in-out infinite`,
      },
    ];
    return animations[index % animations.length];
  };

  // Inject animations on mount
  useEffect(() => {
    const styleElement = document.createElement("style");
    let styleContent = "";

    imagesRef.current.forEach((_, index) => {
      const anim = getRandomAnimation(index);
      styleContent += anim.keyframes;
    });

    styleElement.innerHTML = styleContent;
    document.head.appendChild(styleElement);

    imagesRef.current.forEach((img, index) => {
      const anim = getRandomAnimation(index);
      if (img) img.style.animation = anim.animation;
      if (shadowsRef.current[index]) {
        shadowsRef.current[index].style.animation = anim.animation;
      }
    });

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Assign refs
  const setImageRef = (el: HTMLImageElement | null, index: number) => {
    if (el) imagesRef.current[index] = el;
  };

  const setShadowRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) shadowsRef.current[index] = el;
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] bg-white p-8 md:p-12 w-full">
      {/* Left Text Content (unchanged) */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
          Our Hire Us Process:
          <br />
          <span className="text-indigo-600">From Planning to Deployment.</span>
        </h1>
        <p className="text-lg text-ink-muted mb-8 leading-relaxed">
          We handle your project from planning to deployment with professional,
          end-to-end solutions.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors">
          <a href="https://ughe.org/innovation-center-ughe">More Info</a>
        </button>
      </div>

      {/* Right Floating Images with tighter spacing */}
      <div className="relative md:w-1/2 h-[60vh] flex items-center justify-center">
        <div className="relative w-full h-full">
          {[...Array(11)].map((_, index) => {
            // Reduced random spread for tighter grouping
            const top = 10 + Math.random() * 60; // Reduced vertical spread (was 0-70)
            const left = 10 + Math.random() * 60; // Reduced horizontal spread (was 0-70)
            const size = 40 + Math.random() * 30; // Slightly smaller images (40-70px)

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                <img
                  ref={(el) => setImageRef(el, index)}
                  src="/hireus/hum.jpg"
                  alt=""
                  className="relative z-10 w-full h-full object-cover"
                  style={{
                    borderRadius: borderRadiusValues[index],
                    filter: "brightness(1.05)",
                    willChange: "transform",
                  }}
                />
                <span
                  ref={(el) => setShadowRef(el, index)}
                  className="absolute inset-0 bg-indigo-100 opacity-30 blur-sm"
                  style={{
                    borderRadius: borderRadiusValues[index],
                    transform: "translate(3px, 3px)",
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HireUsHero;
