import { describe, it, expect } from "vitest";
import Graph from "./Graph";

describe("Graph", () => {
  describe("constructor", () => {
    it("initializes with an empty nodes map", () => {
      const graph = new Graph();
      expect(graph.nodes).toBeInstanceOf(Map);
      expect(graph.nodes.size).toBe(0);
    });
  });

  describe("addNode", () => {
    it("adds a node to the graph and returns it", () => {
      const graph = new Graph();
      const node = graph.addNode("Pest");

      expect(node.name).toBe("Pest");
      expect(graph.nodes.size).toBe(1);
      expect(graph.nodes.get("Pest")).toBe(node);
    });

    it("adds multiple nodes", () => {
      const graph = new Graph();
      graph.addNode("Pest");
      graph.addNode("Buda");
      graph.addNode("Obuda");

      expect(graph.nodes.size).toBe(3);
    });

    it("overwrites a node with the same name", () => {
      const graph = new Graph();
      const node1 = graph.addNode("Pest");
      const node2 = graph.addNode("Pest");

      expect(graph.nodes.size).toBe(1);
      expect(graph.nodes.get("Pest")).toBe(node2);
      expect(graph.nodes.get("Pest")).not.toBe(node1);
    });
  });

  describe("getNode", () => {
    it("returns the node when it exists", () => {
      const graph = new Graph();
      const node = graph.addNode("Pest");

      expect(graph.getNode("Pest")).toBe(node);
    });

    it("returns undefined when the node does not exist", () => {
      const graph = new Graph();

      expect(graph.getNode("NonExistent")).toBeUndefined();
    });
  });

  describe("addEdge", () => {
    it("connects two existing nodes with a weight", () => {
      const graph = new Graph();
      graph.addNode("Pest");
      graph.addNode("Buda");
      graph.addEdge("Pest", "Buda", 5);

      const pestNode = graph.getNode("Pest")!;
      const budaNode = graph.getNode("Buda")!;
      expect(pestNode.edges.get(budaNode)).toBe(5);
    });

    it("does nothing if the from node does not exist", () => {
      const graph = new Graph();
      graph.addNode("Buda");
      graph.addEdge("NonExistent", "Buda", 5);

      expect(graph.getNode("Buda")!.edges.size).toBe(0);
    });

    it("does nothing if the to node does not exist", () => {
      const graph = new Graph();
      graph.addNode("Pest");
      graph.addEdge("Pest", "NonExistent", 5);

      expect(graph.getNode("Pest")!.edges.size).toBe(0);
    });

    it("does nothing if neither node exists", () => {
      const graph = new Graph();
      graph.addEdge("A", "B", 5);

      expect(graph.nodes.size).toBe(0);
    });

    it("creates a directed edge (not bidirectional)", () => {
      const graph = new Graph();
      graph.addNode("Pest");
      graph.addNode("Buda");
      graph.addEdge("Pest", "Buda", 5);

      const pestNode = graph.getNode("Pest")!;
      const budaNode = graph.getNode("Buda")!;
      expect(pestNode.edges.size).toBe(1);
      expect(budaNode.edges.size).toBe(0);
    });
  });

  describe("getAllNodes", () => {
    it("returns an empty array for an empty graph", () => {
      const graph = new Graph();
      expect(graph.getAllNodes()).toEqual([]);
    });

    it("returns all nodes in the graph", () => {
      const graph = new Graph();
      const node1 = graph.addNode("Pest");
      const node2 = graph.addNode("Buda");
      const node3 = graph.addNode("Obuda");

      const allNodes = graph.getAllNodes();
      expect(allNodes).toHaveLength(3);
      expect(allNodes).toContain(node1);
      expect(allNodes).toContain(node2);
      expect(allNodes).toContain(node3);
    });
  });
});
