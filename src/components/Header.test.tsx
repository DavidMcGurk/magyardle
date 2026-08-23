import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the magyardle logo text", () => {
    render(<Header language="english" setLanguage={vi.fn()} />);
    expect(screen.getByText("magyardle")).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    const { container } = render(
      <Header language="english" setLanguage={vi.fn()} />
    );
    const img = container.querySelector(".logo-img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/logo.png");
  });

  it("renders the language switcher buttons", () => {
    render(<Header language="english" setLanguage={vi.fn()} />);
    expect(screen.getByRole("button", { name: "HU" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });

  it("marks the correct language button as active", () => {
    render(<Header language="hungarian" setLanguage={vi.fn()} />);
    expect(screen.getByRole("button", { name: "HU" })).toHaveClass(
      "button-active"
    );
  });
});
