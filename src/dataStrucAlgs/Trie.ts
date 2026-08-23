import TrieNode from "./TrieNode";

export default class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(prefix: string): string[] {
    if (prefix.length === 0) {
      return this.getAllWords();
    }

    const normalizedPrefix = this.normalizePrefix(prefix);
    let node = this.root;

    for (const char of normalizedPrefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }

    const results: string[] = [];
    this.collectWords(node, normalizedPrefix, results);
    return results;
  }

  getAllWords(): string[] {
    const results: string[] = [];
    this.collectWords(this.root, "", results);
    return results;
  }

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

  private normalizePrefix(prefix: string): string {
    return prefix[0].toUpperCase() + prefix.substring(1).toLowerCase();
  }

  private collectWords(
    node: TrieNode,
    prefix: string,
    results: string[]
  ): void {
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    for (const char in node.children) {
      this.collectWords(node.children[char], prefix + char, results);
    }
  }
}
