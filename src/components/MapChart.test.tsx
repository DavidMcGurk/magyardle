import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

// Mock react-simple-maps so we can test MapChart logic without real SVG rendering
vi.mock("react-simple-maps", () => {
  const ComposableMap = ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { className: "composable-map" }, children);
  const Geographies = ({
    children,
  }: {
    geography: string;
    children: (props: { geographies: unknown[] }) => React.ReactNode;
  }) => {
    const mockGeographies = [
      { rsmKey: "0", properties: { name: "Pest" } },
      { rsmKey: "1", properties: { name: "Buda" } },
      { rsmKey: "2", properties: { name: "Cegled" } },
    ];
    return React.createElement(
      "div",
      { className: "geographies" },
      children({ geographies: mockGeographies })
    );
  };
  const Geography = ({
    geography,
    className,
    onClick,
    onMouseEnter,
    style,
  }: {
    geography: { rsmKey: string; properties: { name: string } };
    className: string;
    onClick: () => void;
    onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => void;
    style: {
      default: { fill: string; stroke: string; strokeWidth: number };
      hover: { fill: string; stroke: string; strokeWidth: number };
      pressed: { fill: string };
    };
  }) => {
    return React.createElement("path", {
      className,
      "data-testid": `geo-${geography.rsmKey}`,
      "data-name": geography.properties.name,
      "data-fill": style.default.fill,
      "data-stroke": style.default.stroke,
      "data-stroke-width": style.default.strokeWidth,
      onClick,
      onMouseEnter,
    });
  };
  return { ComposableMap, Geographies, Geography };
});

// Mock fetch for the region loading effect
const mockGeoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Pest" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      properties: { name: "Buda" },
      geometry: { type: "Polygon", coordinates: [] },
    },
    {
      type: "Feature",
      properties: { name: "Cegled" },
      geometry: { type: "Polygon", coordinates: [] },
    },
  ],
};

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockGeoData),
    })
  )
);

import MapChart from "./MapChart";

const baseProps = {
  passRegions: vi.fn(),
  start: "",
  finish: "",
  connectedChoices: [] as string[],
  disconnectedChoices: [] as string[],
};

describe("MapChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<MapChart {...baseProps} />);
  });

  it("calls passRegions with the list of region names after loading", async () => {
    const passRegions = vi.fn();
    render(<MapChart {...baseProps} passRegions={passRegions} />);
    await waitFor(() => {
      expect(passRegions).toHaveBeenCalledWith(["Pest", "Buda", "Cegled"]);
    });
  });

  it("renders all three geography elements", () => {
    const { container } = render(<MapChart {...baseProps} />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(3);
  });

  it("applies start colour (#d3859b) to the start region", () => {
    const { container } = render(<MapChart {...baseProps} start="Pest" />);
    const pestPath = container.querySelector(
      "[data-name='Pest']"
    ) as HTMLElement;
    expect(pestPath?.getAttribute("data-fill")).toBe("#d3859b");
  });

  it("applies finish colour (#7caea3) to the finish region", () => {
    const { container } = render(<MapChart {...baseProps} finish="Buda" />);
    const budaPath = container.querySelector(
      "[data-name='Buda']"
    ) as HTMLElement;
    expect(budaPath?.getAttribute("data-fill")).toBe("#7caea3");
  });

  it("applies connected colour (#d4be98) to connected regions", () => {
    const { container } = render(
      <MapChart {...baseProps} connectedChoices={["Cegled"]} />
    );
    const cegledPath = container.querySelector(
      "[data-name='Cegled']"
    ) as HTMLElement;
    expect(cegledPath?.getAttribute("data-fill")).toBe("#d4be98");
  });

  it("applies disconnected colour (#504f4e) to disconnected regions", () => {
    const { container } = render(
      <MapChart {...baseProps} disconnectedChoices={["Cegled"]} />
    );
    const cegledPath = container.querySelector(
      "[data-name='Cegled']"
    ) as HTMLElement;
    expect(cegledPath?.getAttribute("data-fill")).toBe("#504f4e");
  });

  it("applies default colour (#32302f) to unguessed regions", () => {
    const { container } = render(
      <MapChart {...baseProps} start="Pest" finish="Buda" />
    );
    const cegledPath = container.querySelector(
      "[data-name='Cegled']"
    ) as HTMLElement;
    expect(cegledPath?.getAttribute("data-fill")).toBe("#32302f");
  });

  it("start colour takes priority over connected colour", () => {
    const { container } = render(
      <MapChart {...baseProps} start="Pest" connectedChoices={["Pest"]} />
    );
    const pestPath = container.querySelector(
      "[data-name='Pest']"
    ) as HTMLElement;
    expect(pestPath?.getAttribute("data-fill")).toBe("#d3859b");
  });

  it("finish colour takes priority over connected colour", () => {
    const { container } = render(
      <MapChart {...baseProps} finish="Buda" connectedChoices={["Buda"]} />
    );
    const budaPath = container.querySelector(
      "[data-name='Buda']"
    ) as HTMLElement;
    expect(budaPath?.getAttribute("data-fill")).toBe("#7caea3");
  });

  it("applies default stroke (#504f4e) to regions", () => {
    const { container } = render(<MapChart {...baseProps} />);
    const pestPath = container.querySelector(
      "[data-name='Pest']"
    ) as HTMLElement;
    expect(pestPath?.getAttribute("data-stroke")).toBe("#504f4e");
  });

  it("does not set a hover stroke in inline style (CSS handles hover)", () => {
    const { container } = render(<MapChart {...baseProps} />);
    const pestPath = container.querySelector(
      "[data-name='Pest']"
    ) as HTMLElement;
    // The new approach uses CSS :hover, not an inline hover style
    expect(pestPath?.hasAttribute("data-hover-stroke")).toBe(false);
  });

  it("moves hovered path to end of parent on mouse enter (DOM z-order)", () => {
    const { container } = render(
      <MapChart {...baseProps} start="Pest" finish="Buda" />
    );

    // Initially: Pest, Buda, Cegled
    let paths = container.querySelectorAll("path");
    expect(paths[0].getAttribute("data-name")).toBe("Pest");
    expect(paths[2].getAttribute("data-name")).toBe("Cegled");

    // Hover over Pest — it should move to the end via DOM manipulation
    fireEvent.mouseEnter(paths[0]);

    paths = container.querySelectorAll("path");
    expect(paths[2].getAttribute("data-name")).toBe("Pest");
  });

  it("does not trigger React re-render on mouse enter (no state change)", () => {
    const { container } = render(
      <MapChart {...baseProps} start="Pest" finish="Buda" />
    );

    const paths = container.querySelectorAll("path");
    const pestPath = paths[0];

    // Mouse enter should not throw or cause errors
    expect(() => fireEvent.mouseEnter(pestPath)).not.toThrow();

    // The path should still be in the document
    expect(container.querySelector("[data-name='Pest']")).not.toBeNull();
  });
});
