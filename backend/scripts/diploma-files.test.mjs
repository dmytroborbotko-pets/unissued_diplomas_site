import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { parseEnglish, orderOf } from './diploma-files.mjs';

const DOWNLOADS = new URL('../../downloads/', import.meta.url);

test('parseEnglish reads order and surname', () => {
  assert.deepEqual(parseEnglish('12d Kotlubei_HD.jpg'), { order: 12, studentName: 'Kotlubei' });
  assert.deepEqual(parseEnglish('6 Levchuk_HD.jpg'), { order: 6, studentName: 'Levchuk' });
  assert.deepEqual(parseEnglish('1d Yevdokymov EU_HD.jpg'), { order: 1, studentName: 'Yevdokymov' });
  assert.deepEqual(parseEnglish('40d Rybytva merged eu_HD.jpg'), { order: 40, studentName: 'Rybytva' });
});

test('orderOf uses the number, else the surname', () => {
  const students = [{ order: 12, studentName: 'Kotlubei' }, { order: 29, studentName: 'Oblomei' }];
  assert.equal(orderOf('12d Kotlubei, dip+photo, German.jpg', students), 12);
  assert.equal(orderOf('photo+diploma eng+korean 12.jpg', students), 12);
  assert.equal(orderOf('Lysenko Olha 37 diploma+photo eng+jap.jpg', students), 37);
  assert.equal(orderOf('kotlubei_diploma+photo-min.png', students), 12);
  assert.equal(orderOf('oblomey_diploma+photo-min.png', students), 29);
  assert.throws(() => orderOf('unknown_diploma.png', students), /unknown_diploma/);
});

test('every downloaded language maps to exactly students 1..40', { skip: !existsSync(DOWNLOADS) }, () => {
  const students = readdirSync(new URL('English/', DOWNLOADS)).map(parseEnglish);
  for (const lang of readdirSync(DOWNLOADS)) {
    const orders = readdirSync(new URL(`${lang}/`, DOWNLOADS)).map((f) => orderOf(f, students));
    assert.deepEqual(orders.sort((a, b) => a - b), Array.from({ length: 40 }, (_, i) => i + 1), lang);
  }
});
