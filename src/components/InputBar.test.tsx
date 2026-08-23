import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputBar from "./InputBar";

describe("InputBar", () => {
  it("renders the input field with placeholder", () => {
    render(
      <InputBar
        inputValue=""
        onInputChange={vi.fn()}
        onButtonClick={vi.fn()}
        language="english"
      />
    );
    expect(
      screen.getByPlaceholderText("Enter a city, region...")
    ).toBeInTheDocument();
  });

  it("renders the guess button with correct label", () => {
    render(
      <InputBar
        inputValue=""
        onInputChange={vi.fn()}
        onButtonClick={vi.fn()}
        language="english"
      />
    );
    expect(screen.getByRole("button", { name: "Guess" })).toBeInTheDocument();
  });

  it("renders Hungarian placeholder and button when language is hungarian", () => {
    render(
      <InputBar
        inputValue=""
        onInputChange={vi.fn()}
        onButtonClick={vi.fn()}
        language="hungarian"
      />
    );
    expect(
      screen.getByPlaceholderText("Írj be egy várost, megyét...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tipp" })).toBeInTheDocument();
  });

  it("displays the current input value", () => {
    render(
      <InputBar
        inputValue="Budapest"
        onInputChange={vi.fn()}
        onButtonClick={vi.fn()}
        language="english"
      />
    );
    expect(screen.getByDisplayValue("Budapest")).toBeInTheDocument();
  });

  it("calls onInputChange when typing", () => {
    const onInputChange = vi.fn();
    render(
      <InputBar
        inputValue=""
        onInputChange={onInputChange}
        onButtonClick={vi.fn()}
        language="english"
      />
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Pest" },
    });
    expect(onInputChange).toHaveBeenCalledWith("Pest");
  });

  it("calls onButtonClick when the guess button is clicked", () => {
    const onButtonClick = vi.fn();
    render(
      <InputBar
        inputValue=""
        onInputChange={vi.fn()}
        onButtonClick={onButtonClick}
        language="english"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Guess" }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});
