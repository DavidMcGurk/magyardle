export default function processName(
  input: string,
  destination: boolean
): string {
  let declension: string = input;
  let suffix: string = "";

  const illative =
    input.endsWith("Megye") ||
    ["Salgótarján", "Dunaújváros", "Veszprém", "Debrecen"].includes(input);

  const lastWord = input.split(/[-\s]/).pop() || "";
  // Hungarian vowel harmony: front rounded vowels (ö, ő, ü, ű) are not neutral
  // and force front harmony even when back vowels are also present (e.g.
  // "Hódmezővásárhely" contains back vowels ó/á but also the front rounded
  // vowel ő, so it takes front suffixes: "Hódmezővásárhelyre").
  const hasFrontRounded = /[öőüű]/i.test(lastWord);
  const frontVowel: boolean = hasFrontRounded || !/[aáoóuú]/i.test(lastWord);

  if (destination && illative) {
    if (frontVowel) {
      suffix = "be";
    } else {
      suffix = "ba";
    }
  } else if (destination && !illative) {
    if (frontVowel) {
      suffix = "re";
    } else {
      suffix = "ra";
    }
  } else if (!destination && illative) {
    if (frontVowel) {
      suffix = "ből";
    } else {
      suffix = "ból";
    }
  } else if (!destination && !illative) {
    if (frontVowel) {
      suffix = "ről";
    } else {
      suffix = "ról";
    }
  }

  const finalCharacter = declension[declension.length - 1];
  if (finalCharacter === "a") {
    declension = declension.slice(0, declension.length - 1) + "á";
  } else if (finalCharacter === "e") {
    declension = declension.slice(0, declension.length - 1) + "é";
  }

  declension = declension + suffix;
  return declension;
}
