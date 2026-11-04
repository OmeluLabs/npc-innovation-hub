jest.mock("../../hooks/useHeroMedia", () => ({
  __esModule: true,
  useHeroMedia: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useHeroMedia } from "../../hooks/useHeroMedia";

const mockedUseHeroMedia = useHeroMedia as jest.Mock;

function renderHero() {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );
}

describe("<HeroSection />", () => {
  // No active hero media configured - the background falls back to the
  // static image, same as a real "nothing uploaded yet" homepage. The
  // background media carousel itself has its own dedicated tests.
  beforeEach(() => {
    mockedUseHeroMedia.mockReturnValue({
      media: [],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });
  });

  afterEach(() => jest.clearAllMocks());

  test("shows the headline, value proposition and tagline", () => {
    renderHero();

    expect(
      screen.getByRole("heading", { level: 1, name: /driving innovation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/turn classroom ideas/i)).toBeInTheDocument();
    expect(screen.getByText("Innovate. Create. Build.")).toBeInTheDocument();
  });

  test("offers a primary call to apply and a secondary call to see projects", () => {
    renderHero();

    expect(
      screen.getByRole("link", { name: /apply to join/i }),
    ).toHaveAttribute("href", "/apply");
    expect(
      screen.getByRole("link", { name: /see our projects/i }),
    ).toHaveAttribute("href", "/projects");
  });

  test("does not render a member roster in the hero", () => {
    renderHero();

    expect(screen.queryByText("Full Stack Developer")).not.toBeInTheDocument();
  });
});
