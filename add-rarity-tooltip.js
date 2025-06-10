#!/usr/bin/env node

import fs from "fs";
import path from "path";

const localesDir = path.join(process.cwd(), "src", "i18n", "locales");

const translations = {
  en: "Shows how rare this achievement is - lower percentages mean it's rarer",
  de: "Zeigt an, wie selten dieses Achievement ist - niedrigere Prozentwerte bedeuten, dass es seltener ist",
  es: "Muestra lo raro que es este logro: porcentajes más bajos significan que es más raro",
  fr: "Indique la rareté de ce succès - des pourcentages plus faibles signifient qu'il est plus rare",
  it: "Mostra quanto è raro questo achievement - percentuali più basse significano che è più raro",
  pt: "Mostra o quão raro é este achievement - percentagens mais baixas significam que é mais raro",
  da: "Viser hvor sjælden denne præstation er - lavere procenter betyder, at den er sjældnere",
  nl: "Toont hoe zeldzaam deze achievement is - lagere percentages betekenen dat het zeldzamer is",
  sv: "Visar hur sällsynt denna prestation är - lägre procentsatser betyder att den är mer sällsynt",
  fi: "Näyttää kuinka harvinainen tämä saavutus on - matalammat prosentit tarkoittavat, että se on harvinaisempi",
};

for (const [lang, translation] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.ts`);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Find the achievements.rarity line and add tooltip after it
    const rarityRegex = /("achievements\.rarity": ".*?",)/;
    const match = content.match(rarityRegex);

    if (match && !content.includes("achievements.rarity.tooltip")) {
      const replacement = `${match[1]}\n  "achievements.rarity.tooltip": "${translation}",`;
      content = content.replace(rarityRegex, replacement);

      fs.writeFileSync(filePath, content);
      console.log(`Added achievements.rarity.tooltip to ${lang}.ts`);
    } else if (content.includes("achievements.rarity.tooltip")) {
      console.log(`achievements.rarity.tooltip already exists in ${lang}.ts`);
    } else {
      console.log(`Could not find achievements.rarity in ${lang}.ts`);
    }
  } else {
    console.log(`File ${filePath} does not exist`);
  }
}
