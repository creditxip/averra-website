import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotifySection } from "./NotifySection";

describe("flagship parent notification", () => {
  it("shows the one-click caption and the simulated-demonstration label", () => {
    render(<NotifySection />);
    expect(
      screen.getByRole("heading", { name: "From the gradebook to a parent's phone." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No separate email. One click from the gradebook."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Simulated demonstration").length).toBeGreaterThan(0);
    expect(screen.getByText("Select")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay" })).toBeInTheDocument();
  });

  it("lets a teacher choose Alex Morgan, a message type, and send", () => {
    render(<NotifySection />);
    fireEvent.click(screen.getByRole("button", { name: /Alex Morgan/ }));
    fireEvent.click(screen.getByRole("button", { name: "Notify Parent" }));
    expect(
      screen.getByDisplayValue(/Cellular Respiration Lab is due tomorrow/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Attendance" }));
    expect(screen.getByDisplayValue(/arrived 10 minutes late/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Academic progress" }));
    expect(screen.getByDisplayValue(/46\/50/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByDisplayValue(/quick note about Alex/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
  });
});
