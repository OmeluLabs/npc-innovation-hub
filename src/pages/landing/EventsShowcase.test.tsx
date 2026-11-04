const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  // The event card's Register button is a real link; a plain anchor stands in.
  Link: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("../../hooks/useEvents", () => ({
  __esModule: true,
  useEvents: jest.fn(),
}));

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEvents } from "../../hooks/useEvents";
import EventsShowcase from "./EventsShowcase";

const mockedUseEvents = useEvents as jest.Mock;

const HOUR_MS = 60 * 60 * 1000;

function futureEvent(overrides: Record<string, unknown> = {}) {
  const start = new Date(Date.now() + 7 * 24 * HOUR_MS);
  const end = new Date(start.getTime() + 2 * HOUR_MS);
  return {
    id: "event-future",
    title: "Intro to AI/ML for Developers",
    location: "Innovation Hub, Kigali",
    description: "A hands-on session on getting started with AI/ML.",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    imageUrl: "https://example.com/event.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function pastEvent(overrides: Record<string, unknown> = {}) {
  const start = new Date(Date.now() - 30 * 24 * HOUR_MS);
  const end = new Date(start.getTime() + 2 * HOUR_MS);
  return futureEvent({
    id: "event-past",
    title: "Already Happened",
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    ...overrides,
  });
}

function baseHookReturn(overrides: Record<string, unknown> = {}) {
  return {
    events: [],
    loading: false,
    error: null,
    fetchEvents: jest.fn(),
    ...overrides,
  };
}

describe("<EventsShowcase />", () => {
  afterEach(() => jest.clearAllMocks());

  test("shows a loading skeleton before data resolves", () => {
    mockedUseEvents.mockReturnValue(baseHookReturn({ loading: true }));

    const { container } = render(<EventsShowcase />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders only upcoming events, not past ones", () => {
    mockedUseEvents.mockReturnValue(
      baseHookReturn({ events: [futureEvent(), pastEvent()] }),
    );

    render(<EventsShowcase />);

    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
    expect(
      screen.getByText("Intro to AI/ML for Developers"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Already Happened")).not.toBeInTheDocument();
  });

  test("falls back to Recent Events when nothing is upcoming but past events exist", () => {
    mockedUseEvents.mockReturnValue(
      baseHookReturn({ events: [pastEvent({ title: "Already Happened" })] }),
    );

    render(<EventsShowcase />);

    expect(screen.getByText("Recent Events")).toBeInTheDocument();
    expect(screen.getByText("Already Happened")).toBeInTheDocument();
    expect(screen.queryByText("Upcoming Events")).not.toBeInTheDocument();
  });

  test("renders nothing when there are no events at all", () => {
    mockedUseEvents.mockReturnValue(baseHookReturn());

    const { container } = render(<EventsShowcase />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when the fetch fails, rather than showing an error banner", () => {
    mockedUseEvents.mockReturnValue(baseHookReturn({ error: "Network error" }));

    const { container } = render(<EventsShowcase />);

    expect(container).toBeEmptyDOMElement();
  });

  test("offers a Register link for an upcoming event", () => {
    mockedUseEvents.mockReturnValue(
      baseHookReturn({ events: [futureEvent()] }),
    );

    render(<EventsShowcase />);

    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/dashboard/events",
    );
  });

  test("does not offer registration for past events", () => {
    mockedUseEvents.mockReturnValue(
      baseHookReturn({ events: [pastEvent({ title: "Already Happened" })] }),
    );

    render(<EventsShowcase />);

    expect(
      screen.queryByRole("link", { name: "Register" }),
    ).not.toBeInTheDocument();
  });

  test("View All Events opens the public events page", async () => {
    const user = userEvent.setup();
    mockedUseEvents.mockReturnValue(
      baseHookReturn({ events: [futureEvent()] }),
    );

    render(<EventsShowcase />);
    await user.click(screen.getByRole("button", { name: "View All Events" }));

    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });
});
