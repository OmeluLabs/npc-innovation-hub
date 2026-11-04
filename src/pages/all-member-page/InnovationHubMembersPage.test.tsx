jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getAllPublicMembers: jest.fn(),
}));

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { InnovationHubMembersPage } from "./InnovationHubMembersPage";
import { getAllPublicMembers } from "../../api/member/member.api";
import type { PublicMemberSummary } from "../../api/member/member.api";

const mockedGetAll = getAllPublicMembers as jest.Mock;

const person = (
  overrides: Partial<PublicMemberSummary> & { id: string; name: string },
): PublicMemberSummary => ({
  userId: `user-${overrides.id}`,
  role: "Backend Developer",
  ...overrides,
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/members"]}>
      <Routes>
        <Route path="/members" element={<InnovationHubMembersPage />} />
        <Route path="/members/:id" element={<div>detail page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("InnovationHubMembersPage", () => {
  beforeEach(() => mockedGetAll.mockReset());

  test("shows a loading state before data resolves", () => {
    mockedGetAll.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByLabelText("Loading members")).toBeInTheDocument();
  });

  test("groups people into Co-Founders, Leaders and Members", async () => {
    mockedGetAll.mockResolvedValue([
      person({ id: "1", name: "Ada Founder", leadershipTier: "Co-Founder" }),
      person({
        id: "2",
        name: "Lee Leader",
        leadershipTier: "Leader",
        leadershipTitle: "Head of Engineering",
      }),
      person({ id: "3", name: "Mia Member" }),
    ]);
    renderPage();

    const founders = within(
      await screen.findByRole("region", { name: "Co-Founders" }),
    );
    expect(founders.getByText("Ada Founder")).toBeInTheDocument();

    const leaders = within(screen.getByRole("region", { name: "Leaders" }));
    expect(leaders.getByText("Lee Leader")).toBeInTheDocument();
    expect(leaders.getByText("Head of Engineering")).toBeInTheDocument();

    const members = within(screen.getByRole("region", { name: "Members" }));
    expect(members.getByText("Mia Member")).toBeInTheDocument();
  });

  test("does not render a tier that has nobody in it", async () => {
    mockedGetAll.mockResolvedValue([person({ id: "3", name: "Mia Member" })]);
    renderPage();

    await screen.findByText("Mia Member");
    expect(
      screen.queryByRole("region", { name: "Co-Founders" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Leaders" }),
    ).not.toBeInTheDocument();
  });

  test("shows an empty state when there are no members", async () => {
    mockedGetAll.mockResolvedValue([]);
    renderPage();
    expect(
      await screen.findByText("No members to show yet"),
    ).toBeInTheDocument();
  });

  test("shows the error message when loading fails", async () => {
    mockedGetAll.mockRejectedValue(new Error("boom"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    renderPage();
    expect(await screen.findByText("boom")).toBeInTheDocument();
  });

  test("opens a member's profile when their name is clicked", async () => {
    mockedGetAll.mockResolvedValue([person({ id: "3", name: "Mia Member" })]);
    renderPage();

    await userEvent.click(
      await screen.findByRole("button", { name: "Mia Member" }),
    );
    expect(await screen.findByText("detail page")).toBeInTheDocument();
  });
});
