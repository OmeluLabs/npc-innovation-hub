jest.mock("../../api/applicationService", () => ({
  __esModule: true,
  submitMembershipApplication: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ApplyPage } from "./ApplyPage";
import { submitMembershipApplication } from "../../api/applicationService";

const mockedSubmit = submitMembershipApplication as jest.Mock;

function renderPage() {
  return render(
    <MemoryRouter>
      <ApplyPage />
    </MemoryRouter>,
  );
}

const fillValidForm = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Full Name/), "Jane Doe");
  await user.type(screen.getByLabelText(/Email Address/), "jane@example.com");
  await user.type(screen.getByLabelText(/Phone Number/), "+250781234567");
  await user.selectOptions(screen.getByLabelText(/Gender/), "Female");
  await user.type(
    screen.getByLabelText(/GitHub URL/),
    "https://github.com/janedoe",
  );
  await user.type(screen.getByLabelText(/Add a skill/), "React{Enter}");
  await user.type(screen.getByLabelText(/Your Strengths/), "Fast learner");
  await user.type(screen.getByLabelText(/Your Weaknesses/), "Impatient");

  const letterInput = document.getElementById(
    "apply-letter",
  ) as HTMLInputElement;
  const letterFile = new File(["content"], "letter.pdf", {
    type: "application/pdf",
  });
  await act(async () => {
    await user.upload(letterInput, letterFile);
  });

  const photoInput = document.getElementById("apply-photo") as HTMLInputElement;
  const photoFile = new File(["content"], "photo.png", { type: "image/png" });
  await act(async () => {
    await user.upload(photoInput, photoFile);
  });
};

// The form tests type into many fields and take about 5s each, which is the default
// limit; give them headroom so a busy machine does not make them flaky.
jest.setTimeout(20000);

describe("ApplyPage", () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
  });

  test("renders the application form", () => {
    renderPage();
    expect(screen.getByText("Join the Hub")).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Application Letter \(PDF\)/),
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /Submit Application/ }),
    );

    expect(
      await screen.findByText("Full name is required"),
    ).toBeInTheDocument();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  test("shows a success confirmation after a valid submission", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message: "Application submitted successfully.",
      data: { application: {} },
    });
    const user = userEvent.setup();
    renderPage();

    await fillValidForm();
    await user.click(
      screen.getByRole("button", { name: /Submit Application/ }),
    );

    await waitFor(() => {
      expect(screen.getByText("Application Submitted!")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Application submitted successfully."),
    ).toBeInTheDocument();
  });

  test("shows a distinct message for a duplicate (409) application", async () => {
    mockedSubmit.mockRejectedValue({
      statusCode: 409,
      message: "An application from this email is already pending review",
    });
    const user = userEvent.setup();
    renderPage();

    await fillValidForm();
    await act(async () => {
      await user.click(
        screen.getByRole("button", { name: /Submit Application/ }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText("You've already applied")).toBeInTheDocument();
    });
  });
});
