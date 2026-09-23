// One-off: moves today's hardcoded site content into Strapi. Skips any type that already has entries.
// Run: npm run import   (Strapi dev server may keep running)
import { createRequire } from 'node:module';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseEnglish, orderOf } from './diploma-files.mjs';
import { EXHIBITIONS } from '../../frontend/src/constants/exhibitions.js';
import { ACTION_BLOCK_TITLES } from '../../frontend/src/config/actionBlockTitles.js';

const { createStrapi, compileStrapi } = createRequire(import.meta.url)('@strapi/strapi');
const ROOT = path.resolve(import.meta.dirname, '../..');
const DOWNLOADS = path.join(ROOT, 'downloads');
const ASSETS = path.join(ROOT, 'frontend/src/assets');
const DIPLOMA_LANGUAGES = [
  ['English', 'English'], ['German', 'Deutsch'], ['Italian', 'Italiano'], ['Spanish', 'Español'],
  ['French', 'Français'], ['Japanese', '日本語'], ['Chinese', '中文'], ['Korean', '한국어'],
];

const strapi = await createStrapi(await compileStrapi()).load();

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.avif': 'image/avif' };
const upload = async (filepath) => {
  const { size } = await stat(filepath);
  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: { filepath, originalFilename: path.basename(filepath), mimetype: MIME[path.extname(filepath).toLowerCase()], size },
  });
  return file.id;
};

const docs = (uid) => strapi.documents(uid);
const create = (uid, data, locale) => docs(uid).create({ data, locale, status: 'published' });
const isEmpty = async (uid) => (await docs(uid).count({})) === 0;
const run = async (uid, fn) => {
  if (!(await isEmpty(uid))) return console.log(`skip ${uid} (has entries)`);
  await fn();
  console.log(`done ${uid}: ${await docs(uid).count({})}`);
};

// Blocks rich text: p('plain ', { b: 'bold' }, ' plain')
const p = (...parts) => ({
  type: 'paragraph',
  children: parts.map((t) => (typeof t === 'string' ? { type: 'text', text: t } : { type: 'text', text: t.b, bold: true })),
});
const lines = (value) => (Array.isArray(value) ? value.join('\n') : value);

await run('api::exhibition.exhibition', async () => {
  for (const exhibition of EXHIBITIONS) await create('api::exhibition.exhibition', exhibition);
});

await run('api::diploma-language.diploma-language', async () => {
  for (const [order, [, name]] of DIPLOMA_LANGUAGES.entries()) {
    await create('api::diploma-language.diploma-language', { name, order: order + 1 });
  }
});

await run('api::diploma.diploma', async () => {
  const languages = await docs('api::diploma-language.diploma-language').findMany({ status: 'published' });
  const english = await readdir(path.join(DOWNLOADS, 'English'));
  const students = english.map(parseEnglish);
  const versions = new Map(students.map((s) => [s.order, []]));
  for (const [folder, name] of DIPLOMA_LANGUAGES) {
    const language = languages.find((l) => l.name === name).documentId;
    for (const file of await readdir(path.join(DOWNLOADS, folder))) {
      const image = await upload(path.join(DOWNLOADS, folder, file));
      versions.get(orderOf(file, students)).push({ language, image });
    }
    console.log(`  uploaded ${folder}`);
  }
  for (const s of students) await create('api::diploma.diploma', { ...s, versions: versions.get(s.order) });
});

await run('api::faq.faq', async () => {
  const faqs = [
    ['Were only 40 students killed?', 'No, the full-scale russian invasion has taken more student lives, as, in total, more than 6000 civilians and 13 000 soldiers have been reported killed since February 24, 2022. The exact number of students among them is unknown, considering that losses keep increasing every day.'],
    ['Are exhibitions free to attend?', "Yes, exhibitions are free of charge. However, you are welcome to donate, as we want to support financially Ukrainian students who stay in Ukraine and sacrifice their time and education to work for Ukraine's freedom."],
    ['Where can I learn more about other events?', 'You can find more information on our social media, the links to which are just below the FAQ section. We would also highly appreciate you sharing the events with those who might be interested, as we hope for this project to reach as many people as possible.'],
  ];
  for (const [i, [question, answer]] of faqs.entries()) {
    await create('api::faq.faq', { question, answer: [p(answer)], order: i + 1 }, 'en');
  }
});

await run('api::stat.stat', async () => {
  const stats = [
    ['40', 'DIPLOMAS OF STUDENTS KILLED BY RUSSIA', 'diploma'],
    ['300+', 'MEDIA MENTIONS', 'media'],
    ['300+', 'EXHIBITIONS', 'exhibitions'],
    ['23', 'LANGUAGES FOR GLOBAL IMPACT', 'world'],
    ['100+', 'TEAM MEMBERS', 'team'],
    ['CAD $25,000+', 'RAISED FOR THE ENDOWMENT FUND', 'fund'],
  ];
  for (const [i, [number, label, icon]] of stats.entries()) {
    await create('api::stat.stat', { number, label, icon, order: i + 1 }, 'en');
  }
});

await run('api::exhibition-photo.exhibition-photo', async () => {
  const captions = ['Kyiv, 2023', 'Lviv, 2023', 'Warsaw, 2024', 'Berlin, 2024', 'Toronto, 2024', 'Vienna, 2025'];
  for (const [i, caption] of captions.entries()) {
    const image = await upload(path.join(ASSETS, `photo-slider/photo${i + 1}.png`));
    await create('api::exhibition-photo.exhibition-photo', { image, caption, order: i + 1 }, 'en');
  }
});

await run('api::home.home', async () => {
  const blockTitles = (lang) => {
    const t = (block) => ACTION_BLOCK_TITLES[block][lang] ?? {};
    return {
      exhibitionsBlockTitle: lines(t('block2').title), exhibitionsBlockMobileTitle: lines(t('block2').mobileTitle),
      hostBlockTitle: lines(t('block3').title), hostBlockMobileTitle: lines(t('block3').mobileTitle),
      donateBlockTitle: lines(t('block4').title), donateBlockMobileTitle: lines(t('block4').mobileTitle),
    };
  };
  const home = await create('api::home.home', {
    heroTagline: 'When your classroom turns into a battlefield, your major becomes bravery.',
    ...blockTitles('en'),
    aboutHeading: "WHAT'S\nTHE PROJECT\nABOUT?",
    aboutText: [
      p('The "Unissued Diplomas" international exhibitions honor ', { b: 'Ukrainian students who will never graduate because their lives were taken' }, ' by the russian invasion.'),
      p('The project shares the stories of ', { b: '40 students' }, ' — civilians and military service members, young men and women — whose futures were cut short by the war. Through their stories, we commemorate their lives, their contributions, and the impact they had on their communities.'),
      p('Over ', { b: '100 people' }, ' have been involved in bringing the project to life. All united in one mission: to preserve their memory and remind the world that the full-scale war continues to take innocent lives. We operate on a ', { b: 'franchise-based model' }, ' by providing end-to-end support to local organizers for global scalability and impact.'),
    ],
    quoteText: 'NEVER GRADUATED,\nETERNALLY HONORED',
    quoteImage: await upload(path.join(ASSETS, 'ParralaxQuotImage.avif')),
    hallText: [
      p('They used to spend their days in study halls. They had favourite classes and those they dreaded weekly. And how scary it was for them to even think of failing a midterm.'),
      p('But ', { b: 'after February 24, 2022, everything changed for Ukrainian students.' }, ' Classrooms turned into bomb shelters and battlefields. Fear changed its course, and bravery took control.'),
      p({ b: 'Now, diplomas of some will never be issued.' }, " Because russia took the lives of their to-be owners in its attempt to take Ukraine's freedom."),
    ],
    soundcloudUrl: 'https://soundcloud.com/user-418708485/unissued-diplomas-audiotour-1',
    photosHeading: 'Exhibitions Throughout the Years',
    mapHeading: 'GLOBAL IMPACT, ONE EXHIBITION\nAT A TIME',
    mapText: [p('"Unissued Diplomas" operates on a franchise-based model. Our core team prepares all print-ready materials and provides full support to local organizers, ensuring the exhibition can be easily adapted and scaled worldwide.')],
    donateHeading: 'Donate to honor\nTheir Memory',
    donateText: [
      p('The goal of ', { b: 'The Unissued Diplomas Endowment Fund' }, ' is to raise $75,000 USD ($100,000 CAD). Reaching this target — in partnership with the Kyiv-Mohyla Foundations of America and Canada — will allow us to establish a sustainable endowment fund that finances ', { b: 'an annual scholarship' }, '.'),
      p("Each year, this scholarship will cover the full cost of one student's education. It will serve as a living tribute to the students of Kyiv-Mohyla Academy and other universities who lost their lives during Russia's full-scale invasion of Ukraine."),
      p("Through this fund, we honor their memory by investing in what they believed in — education, opportunity, and the future of Ukraine's next generation."),
    ],
    storiesHeading: 'The Stories Behind the Diplomas',
    storiesText: [
      p('We contacted relatives, universities, and the platform Memorial to collect the stories and turn them into Unissued Diplomas.'),
      p('With the consent of parents and families, our team created each story in memory of the students whose lives were taken by the war, honoring their contributions and the future they were building.'),
    ],
    storiesLinkUrl: 'https://memorial.ua',
    sponsorsHeading: 'Sponsors',
    partnersHeading: 'Partners',
    faqHeading: 'FREQUENTLY\nASKED\nQUESTIONS',
  }, 'en');
  // The action-block titles already exist in 5 more languages; everything else falls back to English
  for (const lang of ['uk', 'de', 'it', 'ja', 'es']) {
    await docs('api::home.home').update({ documentId: home.documentId, locale: lang, data: blockTitles(lang), status: 'published' });
  }
});

await run('api::global.global', async () => {
  await create('api::global.global', {
    contactEmail: 'unissueddiplomas@gmail.com',
    // Placeholder URLs copied from the current Footer: admins must replace them with real profiles
    socialLinks: ['instagram', 'facebook', 'linkedin', 'tiktok', 'x'].map((platform) => ({ platform, url: `https://${platform}.com` })),
    copyright: 'Unissued Diplomas ©2026',
    hostExhibitionUrl: '',
  }, 'en');
});

await run('api::exhibitions-page.exhibitions-page', async () => {
  await create('api::exhibitions-page.exhibitions-page', {
    heading: 'Exhibitions',
    subtitle: 'Supported by the Ministry of Education and Science of Ukraine',
  }, 'en');
});

await strapi.destroy();
