export default function processName(
  input: string,
  destination: boolean
): string {
  let frontVowel: boolean = true;
  let declension: string = input;
  let suffix: string = "";

  let illative =
    input.endsWith("Megye") ||
    ["Salgótarján", "Dunaújváros", "Veszprém", "Debrecen"].includes(input);

  const lastWord = input.split(/[-\s]/).pop() || "";
  frontVowel = !/[aáoóuú]/i.test(lastWord);

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
      suffix = "ból";
    } else {
      suffix = "ből";
    }
  } else if (!destination && !illative) {
    if (frontVowel) {
      suffix = "ról";
    } else {
      suffix = "ről";
    }
  }

  const finalCharacter = declension[declension.length - 1];
  if (finalCharacter == "a") {
    declension = declension.slice(0, declension.length - 1) + "á";
  } else if (finalCharacter == "e") {
    declension.slice(0, declension.length - 1) + "é";
  }

  declension = declension + suffix;
  return declension;
}
