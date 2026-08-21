export type Language = "hungarian" | "english";

export const translations = {
  english: {
    loading: "Loading...",
    routePrompt: "Today I'd like to go from",
    to: "to",
    youWin: "You win!",
    inputPlaceholder: "Enter a city, region...",
    guessButton: "Guess",
    guessesHeader: "Guesses:",
    alertStartRegion: "You can't guess the start region!",
    alertTargetRegion: "You can't guess the target region!",
    alertAlreadyGuessed: "You have already guessed {value}",
    alertInvalidInput: "{value} is not a valid input",
  },
  hungarian: {
    loading: "Töltés...",
    routePrompt: "Ma szeretnék menni",
    to: "tól",
    youWin: "Nyertél!",
    inputPlaceholder: "Írj be egy várost, megyét...",
    guessButton: "Tipp",
    guessesHeader: "Tippek:",
    alertStartRegion: "Nem tippelhetsz kiindulási régiót!",
    alertTargetRegion: "Nem tippelhetsz célrégiót!",
    alertAlreadyGuessed: "Már tippelted: {value}",
    alertInvalidInput: "{value} nem érvényes bemenet",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["english"];

export function t(
  language: Language,
  key: TranslationKey,
  value?: string
): string {
  const template = translations[language][key];
  if (value !== undefined) {
    return template.replace("{value}", value);
  }
  return template;
}
