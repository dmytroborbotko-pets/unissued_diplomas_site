// Mock exhibition data keyed by ISO 3166-1 numeric code (matching TopoJSON `id` field)
// Each entry contains country metadata and exhibition list

export const MOCK_EXHIBITIONS = {
  // Ukraine
  "804": {
    name: "Ukraine",
    flag: "\u{1F1FA}\u{1F1E6}",
    isoAlpha2: "UA",
    coordinates: [31.16, 48.38],
    exhibitions: [
      { title: "Unissued Diplomas: Origins", date: "2022-06-15", city: "Kyiv" },
      { title: "Student Voices", date: "2023-02-24", city: "Lviv" },
      { title: "Memorial Exhibition", date: "2024-02-24", city: "Odesa" },
    ],
    count: 3,
  },
  // Germany
  "276": {
    name: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    isoAlpha2: "DE",
    coordinates: [10.45, 51.16],
    exhibitions: [
      { title: "Unissued Diplomas Berlin", date: "2023-05-20", city: "Berlin" },
      { title: "Munich Memorial", date: "2024-02-24", city: "Munich" },
    ],
    count: 2,
  },
  // Poland
  "616": {
    name: "Poland",
    flag: "\u{1F1F5}\u{1F1F1}",
    isoAlpha2: "PL",
    coordinates: [19.15, 51.92],
    exhibitions: [
      { title: "Warsaw Exhibition", date: "2023-03-10", city: "Warsaw" },
      { title: "Krakow Memorial", date: "2024-02-24", city: "Krakow" },
    ],
    count: 2,
  },
  // United States
  "840": {
    name: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    isoAlpha2: "US",
    coordinates: [-95.71, 37.09],
    exhibitions: [
      { title: "NYC Exhibition", date: "2023-09-15", city: "New York" },
      { title: "DC Memorial", date: "2024-02-24", city: "Washington D.C." },
      { title: "Chicago Exhibition", date: "2024-06-10", city: "Chicago" },
    ],
    count: 3,
  },
  // Japan
  "392": {
    name: "Japan",
    flag: "\u{1F1EF}\u{1F1F5}",
    isoAlpha2: "JP",
    coordinates: [138.25, 36.2],
    exhibitions: [
      { title: "Tokyo Memorial", date: "2024-02-24", city: "Tokyo" },
    ],
    count: 1,
  },
  // Italy
  "380": {
    name: "Italy",
    flag: "\u{1F1EE}\u{1F1F9}",
    isoAlpha2: "IT",
    coordinates: [12.57, 41.87],
    exhibitions: [
      { title: "Rome Exhibition", date: "2023-11-05", city: "Rome" },
      { title: "Milan Memorial", date: "2024-02-24", city: "Milan" },
    ],
    count: 2,
  },
  // Spain
  "724": {
    name: "Spain",
    flag: "\u{1F1EA}\u{1F1F8}",
    isoAlpha2: "ES",
    coordinates: [-3.75, 40.46],
    exhibitions: [
      { title: "Madrid Exhibition", date: "2024-02-24", city: "Madrid" },
    ],
    count: 1,
  },
  // France
  "250": {
    name: "France",
    flag: "\u{1F1EB}\u{1F1F7}",
    isoAlpha2: "FR",
    coordinates: [2.21, 46.23],
    exhibitions: [
      { title: "Paris Memorial", date: "2023-06-18", city: "Paris" },
      { title: "Lyon Exhibition", date: "2024-02-24", city: "Lyon" },
    ],
    count: 2,
  },
  // United Kingdom
  "826": {
    name: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    isoAlpha2: "GB",
    coordinates: [-3.44, 55.38],
    exhibitions: [
      { title: "London Exhibition", date: "2023-07-12", city: "London" },
      { title: "Edinburgh Memorial", date: "2024-02-24", city: "Edinburgh" },
    ],
    count: 2,
  },
  // Netherlands
  "528": {
    name: "Netherlands",
    flag: "\u{1F1F3}\u{1F1F1}",
    isoAlpha2: "NL",
    coordinates: [5.29, 52.13],
    exhibitions: [
      { title: "Amsterdam Exhibition", date: "2024-02-24", city: "Amsterdam" },
    ],
    count: 1,
  },
  // Czech Republic
  "203": {
    name: "Czech Republic",
    flag: "\u{1F1E8}\u{1F1FF}",
    isoAlpha2: "CZ",
    coordinates: [15.47, 49.82],
    exhibitions: [
      { title: "Prague Memorial", date: "2024-02-24", city: "Prague" },
    ],
    count: 1,
  },
  // Austria
  "040": {
    name: "Austria",
    flag: "\u{1F1E6}\u{1F1F9}",
    isoAlpha2: "AT",
    coordinates: [14.55, 47.52],
    exhibitions: [
      { title: "Vienna Exhibition", date: "2024-04-15", city: "Vienna" },
    ],
    count: 1,
  },
  // South Korea
  "410": {
    name: "South Korea",
    flag: "\u{1F1F0}\u{1F1F7}",
    isoAlpha2: "KR",
    coordinates: [127.77, 35.91],
    exhibitions: [
      { title: "Seoul Memorial", date: "2024-02-24", city: "Seoul" },
    ],
    count: 1,
  },
  // Australia
  "036": {
    name: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    isoAlpha2: "AU",
    coordinates: [133.78, -25.27],
    exhibitions: [
      { title: "Sydney Exhibition", date: "2024-05-20", city: "Sydney" },
    ],
    count: 1,
  },
  // Canada
  "124": {
    name: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    isoAlpha2: "CA",
    coordinates: [-106.35, 56.13],
    exhibitions: [
      { title: "Toronto Exhibition", date: "2024-02-24", city: "Toronto" },
      { title: "Ottawa Memorial", date: "2024-09-10", city: "Ottawa" },
    ],
    count: 2,
  },
  // Sweden
  "752": {
    name: "Sweden",
    flag: "\u{1F1F8}\u{1F1EA}",
    isoAlpha2: "SE",
    coordinates: [18.64, 60.13],
    exhibitions: [
      { title: "Stockholm Exhibition", date: "2024-02-24", city: "Stockholm" },
    ],
    count: 1,
  },
  // Portugal
  "620": {
    name: "Portugal",
    flag: "\u{1F1F5}\u{1F1F9}",
    isoAlpha2: "PT",
    coordinates: [-8.22, 39.4],
    exhibitions: [
      { title: "Lisbon Memorial", date: "2024-06-15", city: "Lisbon" },
    ],
    count: 1,
  },
};
