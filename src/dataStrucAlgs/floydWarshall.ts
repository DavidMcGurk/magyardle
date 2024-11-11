import Graph from "./Graph.ts";
import Node from "./GraphNode.ts";

const INF = Number.MAX_SAFE_INTEGER;

export default function floydWarshall(
  graph: Graph
): Map<Node, Map<Node, number>> {
  const nodes = graph.getAllNodes();
  const dist: Map<Node, Map<Node, number>> = new Map();

  // Initialize the distance map
  for (let i = 0; i < nodes.length; i++) {
    dist.set(nodes[i], new Map());
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) {
        dist.get(nodes[i])!.set(nodes[j], 0); // Distance to itself is 0
      } else {
        dist.get(nodes[i])!.set(nodes[j], INF); // Initially, distances are set to INF
      }
    }

    // Set the distance to neighboring nodes based on edges
    nodes[i].edges.forEach((weight, neighbor) => {
      dist.get(nodes[i])!.set(neighbor, weight);
    });
  }

  // Floyd-Warshall algorithm
  for (let k = 0; k < nodes.length; k++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        const currentDist = dist.get(nodes[i])!.get(nodes[j])!;
        const newDist =
          dist.get(nodes[i])!.get(nodes[k])! +
          dist.get(nodes[k])!.get(nodes[j])!;
        if (newDist < currentDist) {
          dist.get(nodes[i])!.set(nodes[j], newDist);
        }
      }
    }
  }

  return dist;
}
