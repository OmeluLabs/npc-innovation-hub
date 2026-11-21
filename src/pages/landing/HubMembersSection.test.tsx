jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getAllPublicMembers: jest.fn(),
}));

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HubMembersSection from "./HubMembersSection";
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

function renderSection() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HubMembersSection />} />
        <Route path="/members/:id" element={<div>detail page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("<HubMembersSection />", () => {
  beforeEach(() => mockedGetAll.mockReset());

  test("is the members anchor of the landing page", () => {
    mockedGetAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderSection();
    expect(container.querySelector("#members")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading members")).toBeInTheDocument();
  });

  test("shows Co-Founders, then Leaders, then Members", async () => {
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
    renderSection();

    const founders = within(
      await screen.findByRole("region", { name: "Co-Founders" }),
    );
    expect(founders.getByText("Ada Founder")).toBeInTheDocument();
    const leaders = within(screen.getByRole("region", { name: "Leaders" }));
    expect(leaders.getByText("Head of Engineering")).toBeInTheDocument();
    const members = within(screen.getByRole("region", { name: "Members" }));
    expect(members.getByText("Mia Member")).toBeInTheDocument();

    const order = screen
      .getAllByRole("region")
      .map((r) => r.getAttribute("aria-labelledby"))
      .filter((id) => id?.startsWith("tier-"));
    expect(order).toEqual(["tier-founder", "tier-leader", "tier-member"]);
  });

  test("does not render a tier that has nobody in it", async () => {
    mockedGetAll.mockResolvedValue([person({ id: "3", name: "Mia Member" })]);
    renderSection();
    await screen.findByText("Mia Member");
    expect(
      screen.queryByRole("region", { name: "Co-Founders" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Leaders" }),
    ).not.toBeInTheDocument();
  });

  test("has no separate View All directory button", async () => {
    mockedGetAll.mockResolvedValue([person({ id: "3", name: "Mia Member" })]);
    renderSection();
    await screen.findByText("Mia Member");
    expect(screen.queryByText(/view all/i)).not.toBeInTheDocument();
  });

  test("shows an empty state when there are no members", async () => {
    mockedGetAll.mockResolvedValue([]);
    renderSection();
    expect(
      await screen.findByText("No members to show yet"),
    ).toBeInTheDocument();
  });

  test("shows the error message when loading fails", async () => {
    mockedGetAll.mockRejectedValue(new Error("boom"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    renderSection();
    expect(await screen.findByText("boom")).toBeInTheDocument();
  });

  test("opens a member's profile when their name is clicked", async () => {
    mockedGetAll.mockResolvedValue([person({ id: "3", name: "Mia Member" })]);
    renderSection();
    await userEvent.click(
      await screen.findByRole("button", { name: "Mia Member" }),
    );
    expect(await screen.findByText("detail page")).toBeInTheDocument();
  });
});
