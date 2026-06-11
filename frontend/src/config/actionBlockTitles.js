// Title config for ActionBlocks 2–4 in Main.jsx.
// title: string (no forced breaks) | string[] (each element = new line on desktop)
// mobileTitle: optional override for mobile layout (< 769px)
// Missing language falls back to "en".

export const ACTION_BLOCK_TITLES = {
  block2: {
    en: { title: ["ALL EXHIBITIONS", "& IMPACT"], mobileTitle: ["ALL EXHIBITIONS ", "& IMPACT"] },
    uk: { title: ["ВСІ ВИСТАВКИ", "ТА ВПЛИВ"] },
    de: { title: ["ALLE AUSSTELLUNGEN", "& WIRKUNG"] },
    it: { title: ["TUTTE LE MOSTRE", "& IMPATTO"] },
    ja: { title: ["すべての展覧会", "と影響"] },
    es: { title: ["TODAS LAS", "EXPOSICIONES", "E IMPACTO"] },
  },
  block3: {
    en: { title: ["GET EXHIBITION", "ORGANIZER'S", "GUIDE"], mobileTitle: ["GET EXHIBITION ", "ORGANIZER'S GUIDE"] },
    uk: { title: ["ГАЙД ДЛЯ", "ОРГАНІЗАТОРА", "ВИСТАВКИ"] },
    de: { title: ["LEITFADEN FÜR", "AUSSTELLUNGS-", "ORGANISATOREN"] },
    it: { title: ["GUIDA PER", "L'ORGANIZZATORE", "DELLA MOSTRA"] },
    ja: { title: ["展覧会主催者の", "ガイドを入手"] },
    es: { title: ["GUÍA PARA EL", "ORGANIZADOR DE", "EXPOSICIONES"] },
  },
  block4: {
    en: { title: ["DONATE TO OUR", "ENDOWMENT", "FUND"], mobileTitle: ["DONATE TO OUR ", "ENDOWMENT FUND"] },
    uk: { title: ["ЗАДОНАТИТИ ДО", "ЕНДАУМЕНТНОГО", "ФОНДУ"] },
    de: { title: ["SPENDEN SIE AN", "UNSEREN", "FONDS"] },
    it: { title: ["DONA AL NOSTRO", "FONDO DI", "DOTAZIONE"] },
    ja: { title: ["基金への", "寄付"] },
    es: { title: ["DONA A NUESTRO", "FONDO DE", "DOTACIÓN"] },
  },
};
