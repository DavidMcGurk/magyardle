import type Node from "./GraphNode";

/**
 * Finds the optimal next region to guess.
 *
 * The optimal next guess is a region that:
 * 1. Is adjacent to one of the currently connected choices (valid next guess)
 * 2. Has not already been guessed (not in connectedChoices or disconnectedChoices)
 * 3. Minimises the shortest-path distance to the finish
 *
 * If multiple regions tie for the minimum distance, the one with the lowest
 * index is returned (deterministic).
 *
 * @returns the region name of the optimal next guess, or null if none exists.
 */
export default function findOptimalNext(
  connectedChoices: number[],
  disconnectedChoices: number[],
  adj: number[][],
  regionList: string[],
  regionMap: Map<number, Node>,
  minDistances: Map<Node, Map<Node, number>>,
  finish: Node
): string | null {
  const guessed = new Set<number>([
    ...connectedChoices,
    ...disconnectedChoices,
  ]);

  let bestNode = -1;
  let bestDist = Infinity;

  for (const connected of connectedChoices) {
    for (const neighbour of adj[connected]) {
      if (guessed.has(neighbour)) continue;
      if (neighbour === 0) continue;

      const neighbourNode = regionMap.get(neighbour);
      if (!neighbourNode) continue;

      const dist = minDistances.get(neighbourNode)?.get(finish);
      if (dist === undefined) continue;

      if (dist < bestDist || (dist === bestDist && neighbour < bestNode)) {
        bestDist = dist;
        bestNode = neighbour;
      }
    }
  }

  if (bestNode === -1) return null;
  return regionList[bestNode] ?? null;
}
