// One-off: English values for the new UI-label fields + translations taken from unissueddiplomas.org/{ua,de,it,es,jp}.
// Only sections whose original English still matches ours are included; everything else falls back to English.
// Run with the Strapi dev server stopped: node scripts/import-translations.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const { createStrapi, compileStrapi } = createRequire(import.meta.url)('@strapi/strapi');

const text = (t) => ({ type: 'text', text: t });
const bold = (t) => ({ type: 'text', text: t, bold: true });
const p = (...children) => ({ type: 'paragraph', children: children.map((c) => (typeof c === 'string' ? text(c) : c)) });

const FAQ = JSON.parse(readFileSync(new URL('./translations-faq.json', import.meta.url)));

const DATA = {
  en: {
    home: {
      storiesLinkText: 'Explore more stories on Memorial',
      mapButtonText: "GET EXHIBITION ORGANIZER'S GUIDE",
    },
    global: {
      siteName: 'UNISSUED\nDIPLOMAS',
      navAbout: 'About the Project',
      navExhibitions: 'All Exhibitions',
      navDonations: 'Donations',
      navFaq: 'FAQ',
      navContacts: 'Contacts',
      donateLabel: 'Donate',
      diplomaLanguageLabel: 'Language of diplomas',
      diplomaZoomHint: 'Click on the diploma to zoom in',
      showAllExhibitions: 'Show all exhibitions',
      exhibitionsHeldOne: 'exhibition held',
      exhibitionsHeldOther: 'exhibitions held',
      nowOpen: 'Now open',
      upcoming: 'Upcoming',
      filterAll: 'All',
      noExhibitionsForCountry: 'No exhibitions found for this country.',
      countriesLabel: 'countries',
      venuesLabel: 'venues',
    },
  },
  uk: {
    home: {
      heroTagline: 'Коли твоя аудиторія перетворюється на поле бою, твоїм головним іспитом стає іспит на мужність та сміливість.',
      aboutHeading: 'ПРО ЩО\nНАШ\nПРОЄКТ?',
      quoteText: "ТІ, ХТО ТАК І НЕ ЗАКІНЧИВ СВІЙ ВУЗ,\nТІ, КОГО ЗАВЖДИ ПАМ'ЯТАТИМЕМО",
      hallText: [
        p('Вони проводили свої дні у кампусах, бібліотеках та університетських корпусах. У них були улюблені предмети та ті, вивчення яких вони воліли б уникнути. Найбільшим їхнім страхом було провалити семестр.'),
        p(bold('24 лютого 2022 року українських студентів спіткала зовсім інша реальність.'), ' Аудиторії ВУЗів перетворились на бомбосховища та поле битви. Місце страху заступила сміливість.'),
        p(bold('Дехто так ніколи і не отримає свій диплом'), ' через те, що росія позбавила їх життя намагаючись забрати свободу в України.'),
      ],
      sponsorsHeading: 'Спонсори',
      partnersHeading: 'Партнери',
      faqHeading: 'ПОШИРЕНІ\nЗАПИТАННЯ',
      storiesLinkText: "Дізнайся більше історій загиблих українців на Платформі Пам'яті Меморіал",
    },
    global: {
      siteName: 'НЕВИДАНІ\nДИПЛОМИ',
      navAbout: 'Про що наш проєкт',
      navFaq: 'Поширені запитання',
      navContacts: 'Контакти',
      donateLabel: 'Задонатити',
    },
  },
  de: {
    home: {
      heroTagline: 'Ihr Hauptfach ist Mut',
      aboutHeading: 'WORUM GEHT ES\nIN DEM\nPROJEKT?',
      quoteText: 'NIE GRADUIERT,\nFÜR IMMER GEWÜRDIGT',
      hallText: [
        p('Gewöhnlich verbrachten sie ihre Tage in Studiensälen. Sie hatten Lieblingskurse und solche, die sie wöchentlich ungern besuchten. Alleine der Gedanke, bei einer Zwischenprüfung durchzufallen, machte ihnen Angst.'),
        p('Doch ', bold('nach dem 24. Februar 2022 änderte sich für die ukrainischen Studierenden alles.'), ' Die Hörsäle verwandelten sich in Luftschutzbunker und Schlachtfelder. Die Angst hat ihren Kurs geändert, und der Mut hat die Kontrolle übernommen.'),
        p(bold('Nun werden einige von ihnen nie ein Abschlusszeugnis erhalten'), ', weil bei dem Versuch der Ukraine die Freiheit zu rauben russland ihnen das Leben genommen hat.'),
      ],
      sponsorsHeading: 'Sponsoren',
      partnersHeading: 'Partner',
      faqHeading: 'HÄUFIG\nGESTELLTE\nFRAGEN',
      storiesLinkText: 'Erkunden Sie weitere Geschichten auf Memorial',
    },
    global: {
      navAbout: 'Über das Projekt',
      navContacts: 'Kontakte',
      donateLabel: 'Spenden Sie',
    },
  },
  it: {
    home: {
      heroTagline: 'Quando la tua classe si trasforma in un campo di battaglia, la tua specializzazione diventa coraggio.',
      aboutHeading: 'CHE COSA\nIL PROGETTO?',
      quoteText: 'MAI LAUREATO,\nETERNAMENTE ONORATO',
      sponsorsHeading: 'Sponsor',
      partnersHeading: 'Partner',
      faqHeading: 'DOMANDE\nFREQUENTI',
      storiesLinkText: 'Esplora altre storie su Memorial',
    },
    global: {
      siteName: 'DIPLOMI\nNON RILASCIATI',
      navAbout: 'Il progetto',
      navContacts: 'Contatti',
      donateLabel: 'Donare',
    },
    stats: { 2: 'MOSTRE' },
  },
  es: {
    home: {
      aboutHeading: '¿DE QUÉ\nTRATA EL\nPROYECTO?',
      quoteText: 'NUNCA GRADUADOS,\nETERNAMENTE HONRADOS',
      hallText: [
        p('Se pasaban el día en las salas de estudio. Tenían clases favoritas y otras que temían semanalmente. Y qué miedo les daba siquiera pensar en suspender un parcial.'),
        p('Pero ', bold('después del 24 de febrero de 2022, todo cambió para los estudiantes ucranianos.'), ' Las aulas se convirtieron en refugios antiaéreos y campos de batalla. El miedo cambió de rumbo y la valentía tomó el control.'),
        p(bold('Ahora, los diplomas de algunos nunca se expedirán.'), ' Porque Rusia acabó con la vida de sus futuros propietarios en su intento de arrebatar la libertad a Ucrania.'),
      ],
      sponsorsHeading: 'Patrocinadores',
      partnersHeading: 'Colaboradores',
      faqHeading: 'PREGUNTAS\nFRECUENTES',
      storiesLinkText: 'Más artículos sobre el Memorial',
    },
    global: {
      siteName: 'DIPLOMAS\nNO EXPEDIDOS',
      navAbout: 'Sobre el proyecto',
      navContacts: 'Contactos',
      donateLabel: 'Dona aquí',
    },
  },
  ja: {
    home: {
      heroTagline: '教室が戦場に変わるとき、勇敢が君の専攻になる。',
      aboutHeading: '発行されなかった\n卒業証書とは？',
      quoteText: '卒業叶わずに帰らぬ学生の\n名誉を永遠に讃えて',
      sponsorsHeading: '後援者',
      partnersHeading: 'パートナー',
      faqHeading: 'よくある質問',
    },
    global: {
      siteName: '発行されなかった\n卒業証書',
      navAbout: 'プロジェクトについて',
      navFaq: 'よくある質問',
      donateLabel: '寄付',
    },
  },
};

const strapi = await createStrapi(await compileStrapi()).load();
const docs = (uid) => strapi.documents(uid);

// Writes one locale of a document (creating it if missing) and publishes it
const save = async (uid, documentId, locale, data) => {
  await docs(uid).update({ documentId, locale, data });
  await docs(uid).publish({ documentId, locale });
};

const enList = (uid) => docs(uid).findMany({ locale: 'en', status: 'published', sort: 'order:asc' });
const [home, global] = await Promise.all(['api::home.home', 'api::global.global'].map((uid) => docs(uid).findFirst({ locale: 'en' })));
const [faqs, stats] = await Promise.all([enList('api::faq.faq'), enList('api::stat.stat')]);

for (const [locale, t] of Object.entries(DATA)) {
  if (t.home) await save('api::home.home', home.documentId, locale, t.home);
  if (t.global) await save('api::global.global', global.documentId, locale, t.global);
  for (const [i, item] of (FAQ[locale] ?? []).entries()) {
    if (!item || locale === 'en') continue;
    const [question, answer] = item;
    await save('api::faq.faq', faqs[i].documentId, locale, { question, answer: [p(answer)], order: faqs[i].order });
  }
  for (const [i, label] of Object.entries(t.stats ?? {})) {
    const { number, icon, order, documentId } = stats[i];
    await save('api::stat.stat', documentId, locale, { label, number, icon, order });
  }
  console.log(`done ${locale}`);
}

await strapi.destroy();
