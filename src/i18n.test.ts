import { describe, it, expect } from "vitest";
import { t, translations, type Language, type TranslationKey } from "./i18n";

const languages: Language[] = ["english", "hungarian"];
const allKeys = Object.keys(translations.english) as TranslationKey[];

describe("i18n translations", () => {
  describe("translation key parity", () => {
    it("english and hungarian have the same keys", () => {
      const englishKeys = Object.keys(translations.english).sort();
      const hungarianKeys = Object.keys(translations.hungarian).sort();
      expect(hungarianKeys).toEqual(englishKeys);
    });

    it("all keys have non-empty string values in both languages", () => {
      for (const lang of languages) {
        for (const key of allKeys) {
          const value = translations[lang][key];
          expect(typeof value).toBe("string");
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("t() helper", () => {
    it("returns the correct string for each language and key", () => {
      expect(t("english", "loading")).toBe("Loading...");
      expect(t("hungarian", "loading")).toBe("Töltés...");
      expect(t("english", "youWin")).toBe("You win!");
      expect(t("hungarian", "youWin")).toBe("Nyertél!");
      expect(t("english", "guessButton")).toBe("Guess");
      expect(t("hungarian", "guessButton")).toBe("Tipp");
    });

    it("interpolates {value} placeholder when value is provided", () => {
      expect(t("english", "alertAlreadyGuessed", "Pest")).toBe(
        "You have already guessed Pest"
      );
      expect(t("hungarian", "alertAlreadyGuessed", "Pest")).toBe(
        "Már tippelted: Pest"
      );
      expect(t("english", "alertInvalidInput", "XYZ")).toBe(
        "XYZ is not a valid input"
      );
      expect(t("hungarian", "alertInvalidInput", "XYZ")).toBe(
        "XYZ nem érvényes bemenet"
      );
    });

    it("returns template with {value} placeholder intact when no value provided", () => {
      expect(t("english", "alertAlreadyGuessed")).toBe(
        "You have already guessed {value}"
      );
      expect(t("hungarian", "alertInvalidInput")).toBe(
        "{value} nem érvényes bemenet"
      );
    });

    it("returns different strings for different languages", () => {
      for (const key of allKeys) {
        const en = t("english", key);
        const hu = t("hungarian", key);
        expect(en).not.toBe(hu);
      }
    });
  });
});
