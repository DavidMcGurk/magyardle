import { describe, it, expect } from "vitest";
import Node from "./GraphNode";

describe("Node", () => {
  describe("constructor", () => {
    it("creates a node with the given name", () => {
      const node = new Node("Pest");
      expect(node.name).toBe("Pest");
    });

    it("initializes with an empty edges map", () => {
      const node = new Node("Pest");
      expect(node.edgeCount).toBe(0);
    });
  });

  describe("addEdge", () => {
    it("adds an edge to another node with a weight", () => {
      const nodeA = new Node("Pest");
      const nodeB = new Node("Buda");
      nodeA.addEdge(nodeB, 5);

      expect(nodeA.edgeCount).toBe(1);
      expect(nodeA.getWeightTo(nodeB)).toBe(5);
    });

    it("supports multiple edges to different nodes", () => {
      const nodeA = new Node("Pest");
      const nodeB = new Node("Buda");
      const nodeC = new Node("Obuda");
      nodeA.addEdge(nodeB, 3);
      nodeA.addEdge(nodeC, 7);

      expect(nodeA.edgeCount).toBe(2);
      expect(nodeA.getWeightTo(nodeB)).toBe(3);
      expect(nodeA.getWeightTo(nodeC)).toBe(7);
    });

    it("overwrites the weight when adding an edge to an existing node", () => {
      const nodeA = new Node("Pest");
      const nodeB = new Node("Buda");
      nodeA.addEdge(nodeB, 5);
      nodeA.addEdge(nodeB, 10);

      expect(nodeA.edgeCount).toBe(1);
      expect(nodeA.getWeightTo(nodeB)).toBe(10);
    });

    it("supports self-loops", () => {
      const nodeA = new Node("Pest");
      nodeA.addEdge(nodeA, 1);

      expect(nodeA.edgeCount).toBe(1);
      expect(nodeA.getWeightTo(nodeA)).toBe(1);
    });

    it("supports zero-weight edges", () => {
      const nodeA = new Node("Pest");
      const nodeB = new Node("Buda");
      nodeA.addEdge(nodeB, 0);

      expect(nodeA.getWeightTo(nodeB)).toBe(0);
    });
  });
});
