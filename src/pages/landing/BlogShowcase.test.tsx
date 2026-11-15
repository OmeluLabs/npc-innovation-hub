const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  // The blog card is a real link now; a plain anchor stands in for it here.
  Link: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("../../hooks/useBlogs", () => ({
  __esModule: true,
  useBlogs: jest.fn(),
}));

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { useBlogs } from "../../hooks/useBlogs";
import BlogShowcase from "./BlogShowcase";

const mockedUseBlogs = useBlogs as jest.Mock;

const sampleBlog = {
  id: "blog-1",
  title: "Introduction to Front-end Development",
  content: "...",
  summary: "A whirlwind tour of the front-end stack we use at the Hub.",
  image: null,
  category: "Front-end",
  authorId: "author-1",
  isPublished: true,
  viewCount: 42,
  createdAt: "2026-04-05T18:52:16.553Z",
  updatedAt: "2026-04-05T18:52:16.553Z",
};

function baseHookReturn(overrides: Record<string, unknown> = {}) {
  return {
    blogs: [],
    loading: false,
    error: null,
    fetchPublishedBlogs: jest.fn(),
    ...overrides,
  };
}

describe("<BlogShowcase />", () => {
  afterEach(() => jest.clearAllMocks());

  test("shows a loading skeleton before data resolves", () => {
    mockedUseBlogs.mockReturnValue(baseHookReturn({ loading: true }));

    const { container } = render(<BlogShowcase />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders published posts once loaded", () => {
    mockedUseBlogs.mockReturnValue(baseHookReturn({ blogs: [sampleBlog] }));

    render(<BlogShowcase />);

    expect(screen.getByText("From the Blog")).toBeInTheDocument();
    expect(
      screen.getByText("Introduction to Front-end Development"),
    ).toBeInTheDocument();
  });

  test("only shows the View All button once there are more posts than the preview count", () => {
    mockedUseBlogs.mockReturnValue(baseHookReturn({ blogs: [sampleBlog] }));
    render(<BlogShowcase />);
    expect(
      screen.queryByRole("button", { name: "View All Posts" }),
    ).not.toBeInTheDocument();
  });

  test("shows an empty state when there are no published posts yet", () => {
    mockedUseBlogs.mockReturnValue(baseHookReturn());

    render(<BlogShowcase />);

    expect(screen.getByText("No articles yet")).toBeInTheDocument();
  });

  test("shows an empty state when the fetch fails", () => {
    mockedUseBlogs.mockReturnValue(baseHookReturn({ error: "Network error" }));

    render(<BlogShowcase />);

    expect(screen.getByText("No articles yet")).toBeInTheDocument();
  });
});
