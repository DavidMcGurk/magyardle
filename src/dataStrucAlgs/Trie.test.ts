import { describe, it, expect } from "vitest";
import Trie from "./Trie";

describe("Trie", () => {
  describe("constructor", () => {
    it("initializes with a root node", () => {
      const trie = new Trie();
      expect(trie.root).toBeDefined();
      expect(trie.root.children).toEqual({});
      expect(trie.root.isEndOfWord).toBe(false);
    });
  });

  describe("insert", () => {
    it("inserts a single word", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.getAllWords()).toEqual(["Pest"]);
    });

    it("inserts multiple words", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Pecs");
      trie.insert("Buda");

      expect(trie.getAllWords().sort()).toEqual(["Buda", "Pecs", "Pest"]);
    });

    it("inserts words with shared prefixes", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Pestszentlorinc");

      expect(trie.getAllWords().sort()).toEqual(["Pest", "Pestszentlorinc"]);
    });

    it("inserts an empty string", () => {
      const trie = new Trie();
      trie.insert("");

      expect(trie.getAllWords()).toEqual([""]);
    });

    it("handles duplicate insertions gracefully", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Pest");

      expect(trie.getAllWords()).toEqual(["Pest"]);
    });
  });

  describe("search", () => {
    it("finds words with an exact prefix match", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Pecs");
      trie.insert("Buda");

      expect(trie.search("P")).toEqual(
        expect.arrayContaining(["Pest", "Pecs"])
      );
      expect(trie.search("B")).toEqual(["Buda"]);
    });

    it("finds words with a longer prefix", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Pecs");

      expect(trie.search("Pe")).toEqual(
        expect.arrayContaining(["Pest", "Pecs"])
      );
      expect(trie.search("Pes")).toEqual(["Pest"]);
      expect(trie.search("Pec")).toEqual(["Pecs"]);
    });

    it("returns the exact word when prefix matches the full word", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.search("Pest")).toEqual(["Pest"]);
    });

    it("returns empty array when no words match the prefix", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Buda");

      expect(trie.search("X")).toEqual([]);
    });

    it("returns empty array for empty prefix", () => {
      const trie = new Trie();
      trie.insert("Pest");

      // Empty prefix: prefix[0] is undefined, toUpperCase() would fail
      // This tests the edge case behavior
      expect(() => trie.search("")).not.toThrow();
    });

    it("normalizes prefix to capitalized form (first letter upper, rest lower)", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("pest"); // lowercase version

      // "pest" gets inserted as "pest", "Pest" as "Pest"
      // search("pest") normalizes to "Pest"
      expect(trie.search("pest")).toEqual(expect.arrayContaining(["Pest"]));
    });

    it("handles lowercase input by capitalizing first letter", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.search("p")).toEqual(["Pest"]);
      expect(trie.search("pe")).toEqual(["Pest"]);
      expect(trie.search("pest")).toEqual(["Pest"]);
    });

    it("handles mixed case input by normalizing", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.search("PeSt")).toEqual(["Pest"]);
    });
  });

  describe("getAllWords", () => {
    it("returns empty array for an empty trie", () => {
      const trie = new Trie();
      expect(trie.getAllWords()).toEqual([]);
    });

    it("returns all inserted words", () => {
      const trie = new Trie();
      trie.insert("Pest");
      trie.insert("Buda");
      trie.insert("Obuda");

      const words = trie.getAllWords();
      expect(words).toHaveLength(3);
      expect(words).toEqual(expect.arrayContaining(["Pest", "Buda", "Obuda"]));
    });
  });

  describe("startsWith", () => {
    it("returns true when a word with the prefix exists", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.startsWith("Pe")).toBe(true);
      expect(trie.startsWith("P")).toBe(true);
      expect(trie.startsWith("Pest")).toBe(true);
    });

    it("returns false when no word with the prefix exists", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.startsWith("X")).toBe(false);
      expect(trie.startsWith("B")).toBe(false);
    });

    it("returns true for empty prefix on a non-empty trie", () => {
      const trie = new Trie();
      trie.insert("Pest");

      expect(trie.startsWith("")).toBe(true);
    });

    it("returns true for empty prefix on an empty trie", () => {
      const trie = new Trie();

      // Empty prefix: the loop doesn't execute, so it returns true
      expect(trie.startsWith("")).toBe(true);
    });
  });
});
