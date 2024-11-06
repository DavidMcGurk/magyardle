import React, { useCallback, useState, useEffect } from "react";
import "../styles/MapChart.css";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

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

  const handleRegionClick = useCallback((geo) => {
    console.log(geo.properties.name);
  }, []);

  const [regions, setRegions] = useState<string[]>([]);

  const getFillColour = (geo: any) => {
    let colour: string;

    if (geo.properties.name === start) {
      colour = "#d3859b";
    } else if (geo.properties.name === finish) {
      colour = "#7caea3";
    } else if (connectedChoices.includes(geo.properties.name)) {
      // console.log("connected: ", geo.properties.name);
      colour = "#d4be98";
    } else if (disconnectedChoices.includes(geo.properties.name)) {
      colour = "#504f4e";
    } else {
      colour = "#32302f";
    }

    return colour;
  };

  useEffect(() => {
    const initialRegions: string[] = [];
    // console.log("this fn is being called");

    const loadInitialRegions = async () => {
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (data && data.features) {
        data.features.forEach((feature: any) => {
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
    console.log(start, finish);
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
        scale: 7000,
        center: [19.5, 47],
      }}
      className="Map"
    >
      <Geographies geography={geoUrl} className="region">
        {({ geographies }) => {
          return geographies.map((geo) => (
            <Geography
              onClick={() => handleRegionClick(geo)}
              key={geo.rsmKey}
              className={geo.properties.name}
              geography={geo}
              style={{
                default: {
                  fill: `${getFillColour(geo)}`,
                  stroke: "#504f4e",
                  zIndex: 1,
                  outline: "none",
                },
                hover: {
                  fill: `${getFillColour(geo)}`,
                  stroke: "#000000",
                  zIndex: 2,
                  outline: "none",
                },
                pressed: {
                  fill: "#d4be98",
                  outline: "none",
                },
              }}
            ></Geography>
          ));
        }}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
