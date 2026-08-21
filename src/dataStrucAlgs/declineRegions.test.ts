import { describe, it, expect } from "vitest";
import processName from "./declineRegions";

describe("processName (Hungarian declension)", () => {
  describe("destination = true (illative: ba/be or ra/re)", () => {
    describe("illative nouns (ending in 'Megye' or special cities)", () => {
      it("uses 'be' for front-vowel Megye regions", () => {
        // "PestMegye" - last word "PestMegye" has front vowels (e is front)
        const result = processName("PestMegye", true);
        expect(result).toBe("PestMegyébe");
      });

      it("uses 'ba' for back-vowel Megye regions", () => {
        // "BacsMegye" - 'a' is back vowel
        const result = processName("BacsMegye", true);
        expect(result).toBe("BacsMegyéba");
      });

      it("uses 'be' for special illative city (Veszprém)", () => {
        const result = processName("Veszprém", true);
        expect(result).toBe("Veszprémbe");
      });

      it("uses 'ba' for special illative city (Salgótarján)", () => {
        const result = processName("Salgótarján", true);
        expect(result).toBe("Salgótarjánba");
      });

      it("uses 'ba' for special illative city (Dunaújváros)", () => {
        const result = processName("Dunaújváros", true);
        expect(result).toBe("Dunaújvárosba");
      });

      it("uses 'be' for special illative city (Debrecen)", () => {
        const result = processName("Debrecen", true);
        expect(result).toBe("Debrecenbe");
      });
    });

    describe("non-illative nouns (ra/re suffix)", () => {
      it("uses 're' for front-vowel regions", () => {
        // "Pécs" - 'é' and 'e' are front vowels
        const result = processName("Pécs", true);
        expect(result).toBe("Pécsre");
      });

      it("uses 'ra' for back-vowel regions", () => {
        // "Bács" - 'á' is back vowel
        const result = processName("Bács", true);
        expect(result).toBe("Bácsra");
      });
    });
  });

  describe("destination = false (elative: ból/ből or ról/ről)", () => {
    describe("illative nouns (ból/ből suffix)", () => {
      it("uses 'ből' for front-vowel Megye regions", () => {
        // "PestMegye" - no back vowels in last word → front vowel → "ből"
        const result = processName("PestMegye", false);
        expect(result).toBe("PestMegyéből");
      });

      it("uses 'ból' for back-vowel Megye regions", () => {
        // "BacsMegye" - 'a' is back vowel → "ból"
        const result = processName("BacsMegye", false);
        expect(result).toBe("BacsMegyéból");
      });
    });

    describe("non-illative nouns (ról/ről suffix)", () => {
      it("uses 'ről' for front-vowel regions", () => {
        // "Pécs" - 'é' is front vowel → "ről"
        const result = processName("Pécs", false);
        expect(result).toBe("Pécsről");
      });

      it("uses 'ról' for back-vowel regions", () => {
        // "Bács" - 'á' is back vowel → "ról"
        const result = processName("Bács", false);
        expect(result).toBe("Bácsról");
      });
    });
  });

  describe("final vowel transformation (a → á, e → é)", () => {
    it("transforms final 'a' to 'á' before adding suffix", () => {
      // "Baja" - back vowel, non-illative → "ra"
      // final 'a' → 'á', so "Bajára"
      const result = processName("Baja", true);
      expect(result).toBe("Bajára");
    });

    it("transforms final 'e' to 'é' before adding suffix", () => {
      // "Baja" with front vowel... need a word ending in 'e' with front vowels
      // "Makó" doesn't end in 'e'. Let's use a word ending in 'e' with front vowels
      // "Bőke" - 'ő' and 'e' are front vowels, ends in 'e'
      const result = processName("Bőke", true);
      expect(result).toBe("Bőkére");
    });

    it("transforms final 'a' to 'á' for non-illative nouns", () => {
      // "Baja" - back vowel ('a'), non-illative → "ról"
      // final 'a' → 'á', so "Bajáról"
      const result = processName("Baja", false);
      expect(result).toBe("Bajáról");
    });
  });

  describe("vowel harmony detection", () => {
    it("detects back vowels in the last word (even when front vowels also present)", () => {
      // "Tiszakecske" - contains 'a' (back vowel) → uses back vowel suffix "ra"
      // Final 'e' → 'é', so "Tiszakecskéra"
      const result = processName("Tiszakecske", true);
      expect(result).toBe("Tiszakecskéra");
    });

    it("detects front vowels when no back vowels present", () => {
      // "Pécs" - 'é' is front vowel, no back vowels → "re"
      const result = processName("Pécs", true);
      expect(result).toBe("Pécsre");
    });

    it("detects back vowels in the last word", () => {
      // Words with back vowels: a, á, o, ó, u, ú
      const result = processName("Bács", true);
      // 'á' is back vowel, non-illative → "ra"
      expect(result).toContain("ra");
    });

    it("uses the last word for vowel harmony in hyphenated names", () => {
      // "Bács-Kiskun" - last word "Kiskun" has 'u' (back vowel)
      const result = processName("Bács-Kiskun", true);
      expect(result).toBe("Bács-Kiskunra");
    });
  });
});
