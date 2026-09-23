// Maps the inconsistent Wix export file names (downloads/<Language>/*) to a student's order number.
const ALIASES = { oblomey: 'oblomei' };

export const parseEnglish = (file) => {
  const [, order, studentName] = file.match(/^(\d+)d? (.+?)(?: merged)?(?: eu)?_HD\.jpg$/i);
  return { order: Number(order), studentName };
};

export const orderOf = (file, students) => {
  const number = file.match(/\b(\d{1,2})d?\b/);
  if (number) return Number(number[1]);
  const surname = file.split(/[_ ,]/)[0].toLowerCase();
  const student = students.find((s) => s.studentName.toLowerCase() === (ALIASES[surname] ?? surname));
  if (!student) throw new Error(`No student for ${file}`);
  return student.order;
};
