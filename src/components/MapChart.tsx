import React, { useCallback, useState, useEffect } from "react";
import "../styles/MapChart.css";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

interface GeoFeatureProperties {
  name: string;
  [key: string]: unknown;
}

interface GeoFeature {
  rsmKey: string;
  properties: GeoFeatureProperties;
  [key: string]: unknown;
}

interface ChildProps {
  passRegions: (regions: string[]) => void;
  start: string;
  finish: string;
  connectedChoices: string[];
  disconnectedChoices: string[];
}

const MapChart: React.FC<ChildProps> = ({
  passRegions,
  start,
  finish,
  connectedChoices,
  disconnectedChoices,
}) => {
  const geoUrl = "/hu.json";

  const handleRegionClick = useCallback((geo: GeoFeature) => {
    // Region click handler - could be used for future interactivity
    void geo;
  }, []);

  const [regions, setRegions] = useState<string[]>([]);

  const getFillColour = (geo: GeoFeature) => {
    let colour: string;

    if (geo.properties.name === start) {
      colour = "#d3859b";
    } else if (geo.properties.name === finish) {
      colour = "#7caea3";
    } else if (connectedChoices.includes(geo.properties.name)) {
      colour = "#d4be98";
    } else if (disconnectedChoices.includes(geo.properties.name)) {
      colour = "#504f4e";
    } else {
      colour = "#32302f";
    }

    return colour;
  };

  // Bring the hovered path to the front via direct DOM manipulation.
  // This avoids React re-renders that would conflict with d3 transitions
  // used internally by react-simple-maps, which caused stuck black borders.
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const path = e.currentTarget;
      const parent = path.parentNode;
      if (parent) {
        parent.appendChild(path);
      }
    },
    []
  );

  useEffect(() => {
    const initialRegions: string[] = [];

    const loadInitialRegions = async () => {
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (data && data.features) {
        data.features.forEach((feature: GeoFeature) => {
          initialRegions.push(feature.properties.name);
        });
      }

      if (initialRegions.length > 0) {
        setRegions(initialRegions);
      }
    };

    loadInitialRegions();
  }, [geoUrl]);

  useEffect(() => {
    // Start/finish changed - could trigger UI updates
  }, [start, finish]);

  useEffect(() => {
    if (regions.length > 0) {
      passRegions(regions);
    }
  }, [regions, passRegions]);

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        scale: 9000,
        center: [19.5, 47],
      }}
      className="Map"
    >
      <Geographies geography={geoUrl} className="region">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              onClick={() => handleRegionClick(geo)}
              key={geo.rsmKey}
              className={geo.properties.name}
              geography={geo}
              onMouseEnter={handleMouseEnter}
              style={{
                default: {
                  fill: `${getFillColour(geo)}`,
                  stroke: "#504f4e",
                  strokeWidth: 1,
                  outline: "none",
                },
                hover: {
                  fill: `${getFillColour(geo)}`,
                  stroke: "#504f4e",
                  strokeWidth: 1,
                  outline: "none",
                },
                pressed: {
                  fill: "#d4be98",
                  outline: "none",
                },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
