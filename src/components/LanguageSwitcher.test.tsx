import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("renders HU and EN buttons", () => {
    render(<LanguageSwitcher language="hungarian" setLanguage={vi.fn()} />);
    expect(screen.getByRole("button", { name: "HU" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });

  it("marks HU button as active when language is hungarian", () => {
    render(<LanguageSwitcher language="hungarian" setLanguage={vi.fn()} />);
    expect(screen.getByRole("button", { name: "HU" })).toHaveClass(
      "button-active"
    );
    expect(screen.getByRole("button", { name: "EN" })).not.toHaveClass(
      "button-active"
    );
  });

  it("marks EN button as active when language is english", () => {
    render(<LanguageSwitcher language="english" setLanguage={vi.fn()} />);
    expect(screen.getByRole("button", { name: "EN" })).toHaveClass(
      "button-active"
    );
    expect(screen.getByRole("button", { name: "HU" })).not.toHaveClass(
      "button-active"
    );
  });

  it("calls setLanguage with 'hungarian' when HU is clicked", () => {
    const setLanguage = vi.fn();
    render(<LanguageSwitcher language="english" setLanguage={setLanguage} />);
    fireEvent.click(screen.getByRole("button", { name: "HU" }));
    expect(setLanguage).toHaveBeenCalledWith("hungarian");
  });

  it("calls setLanguage with 'english' when EN is clicked", () => {
    const setLanguage = vi.fn();
    render(<LanguageSwitcher language="hungarian" setLanguage={setLanguage} />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(setLanguage).toHaveBeenCalledWith("english");
  });
});
