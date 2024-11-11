import React, { useEffect } from "react";

// Define the types for your JSON data
interface Feature {
  id: number;
  geometry: {
    coordinates: number[][];
  };
}

interface GeoJsonData {
  features: Feature[];
}

interface AdjacencyMatrixProps {
  onAdjacencyComputed: (adj: number[][]) => void;
}

const findAdjacencies: React.FC<AdjacencyMatrixProps> = ({
  onAdjacencyComputed,
}) => {
  useEffect(() => {
    const calculateAdjacencies = async () => {
      try {
        // Fetch the JSON file (assuming it's in the public folder)
        const response = await fetch("/hu.json");
        const data: GeoJsonData = await response.json();

        const coords: number[][][] = [[]]; // Array to store coordinates
        let adj: number[][] = [[]]; // Adjacency matrix
        let inEach = new Map<number, Set<string>>(); // Map to store sets of stringified coordinates

        // Populate coordinates
        data.features.forEach((item) => {
          coords.push(item.geometry.coordinates);
        });

        // Populate the 'inEach' map with JSON stringified coordinates
        for (let i = 1; i < coords.length; i++) {
          inEach.set(i, new Set());
          adj.push([]);

          // Loop through each coordinate set, convert them to JSON strings, and add to the set
          for (let j = 0; j < coords[i].length; j++) {
            for (let k = 0; k < coords[i][j].length; k++) {
              const coordString = JSON.stringify(coords[i][j][k]); // Store the coordinate as a string
              inEach.get(i)?.add(coordString);
            }
          }
        }

        // Compare each set for intersection based on the JSON strings
        for (let i = 1; i < coords.length; i++) {
          for (let j = 1; j < coords.length; j++) {
            if (i !== j) {
              for (let item of inEach.get(i) || []) {
                if (inEach.get(j)?.has(item)) {
                  adj[i].push(j); // Add to adjacency list if a matching coordinate is found
                  break;
                }
              }
            }
          }
        }

        onAdjacencyComputed(adj);
      } catch (err) {
        console.error("Error fetching or parsing the file:", err);
      }
    };

    calculateAdjacencies();
  }, []);

  return null;
};

export default findAdjacencies;
