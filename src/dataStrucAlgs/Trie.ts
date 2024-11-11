// Trie.ts
import TrieNode from "./TrieNode";

export default class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // Insert a word into the trie
  insert(word: string): void {
    let node = this.root;

    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    node.isEndOfWord = true;
  }

  // Search for all words that start with the given prefix
  search(prefix: string): string[] {
    const realPrefix =
      prefix[0].toUpperCase() + prefix.substring(1).toLowerCase();
    let node = this.root;
    const results: string[] = [];

    // Traverse the Trie to find the node corresponding to the prefix
    for (const char of realPrefix) {
      if (!node.children[char]) {
        return []; // If prefix is not found, return an empty array
      }
      node = node.children[char];
    }

    // Collect all words that start with the prefix
    this.collectWords(node, realPrefix, results);
    return results;
  }

  getAllWords(): string[] {
    const results: string[] = [];
    this.collectWords(this.root, "", results);
    return results;
  }

  // Helper method to collect words from a given node
  private collectWords(
    node: TrieNode,
    prefix: string,
    results: string[]
  ): void {
    if (node.isEndOfWord) {
      results.push(prefix); // Add the current prefix as a valid word
    }

    // Recursively collect words from child nodes
    for (const char in node.children) {
      this.collectWords(node.children[char], prefix + char, results);
    }
  }

  // Check if there is any word in the trie that starts with the given prefix
  startsWith(prefix: string): boolean {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }

    return true;
  }
}
