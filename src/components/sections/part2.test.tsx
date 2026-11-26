import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DemoRequestProvider } from "@/context/DemoRequestContext";
import { CompareSection } from "./CompareSection";
import { CalculatorSection } from "./CalculatorSection";
import { MarketsSection } from "./MarketsSection";
import { AppsSection } from "./AppsSection";
import { TrustSection } from "./TrustSection";

describe("sections 6–9 and 11", () => {
  it("rebuilds the ecosystem comparison without pricing claims", () => {
    render(<CompareSection />);
    expect(
      screen.getByRole("heading", { name: "Your School's Technology Should Work Together." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Teacher writes an email")).toBeInTheDocument();
    expect(screen.getByText(/complement your existing systems/)).toBeInTheDocument();
    expect(screen.getByText(/trademark of Instructure/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Existing system integration" }));
    expect(screen.getAllByText("Integrations scoped during implementation").length).toBeGreaterThan(
      0,
    );
    const text = document.getElementById("compare")?.textContent ?? "";
    expect(text).not.toMatch(/cheaper/i);
    expect(text).not.toMatch(/\$\d/);
  });

  it("rebuilds the operational estimate and opens from the demo call to action", () => {
    render(
      <DemoRequestProvider>
        <CalculatorSection />
      </DemoRequestProvider>,
    );
    expect(
      screen.getByRole("heading", {
        name: "What Could Your School Save With a More Connected Technology Ecosystem?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Current annual technology expenses")).toBeInTheDocument();
    expect(screen.getByText("A customized AVERRA proposal")).toBeInTheDocument();
    expect(screen.getByText("Tailored to your school")).toBeInTheDocument();
    expect(
      screen.getByText(/Illustrative estimate based on the figures and assumptions you enter/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Discover What Your School Could Accomplish With Averra.",
      }),
    ).toBeInTheDocument();
    const text = document.getElementById("calculator")?.textContent ?? "";
    expect(text).not.toMatch(/cheaper/i);
    expect(text).not.toMatch(/Canvas/i);
  });

  it("shows geographic regions and the five school roles", () => {
    render(<MarketsSection />);
    expect(
      screen.getByRole("heading", { name: "Designed for the Schools Shaping Tomorrow." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Private and independent schools throughout Boston and the surrounding region.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Independent schools across Georgia and Florida.")).toBeInTheDocument();
    expect(
      screen.getByText("Technology designed to support institutions across the country."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Technology Directors" }));
    expect(screen.getByText("Integrations scoped to your systems")).toBeInTheDocument();
    expect(screen.getByText("Managed app deployment")).toBeInTheDocument();
    const text = document.getElementById("markets")?.textContent ?? "";
    expect(text).not.toMatch(/Westbrook|testimonial/i);
  });

  it("shows an iPhone and an Android mockup with the launch steps", () => {
    render(<AppsSection />);
    expect(
      screen.getByRole("heading", {
        name: "Your School's Own Application. We Handle the Technology.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /iPhone showing/ })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /Android showing/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Logo and branding" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Home screen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Parent portal" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Student dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "AI assistant" })).toBeInTheDocument();
    expect(screen.getByText("App Store and Google Play submission assistance")).toBeInTheDocument();
    expect(
      screen.getByText(/Schools retain ownership of their Apple and Google developer accounts/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Publication depends on Apple App Store and Google Play review/),
    ).toBeInTheDocument();
  });

  it("keeps the trust section title", () => {
    render(<TrustSection />);
    expect(
      screen.getByRole("heading", {
        name: "Built Around the Responsibility of Educating Students.",
      }),
    ).toBeInTheDocument();
  });
});
