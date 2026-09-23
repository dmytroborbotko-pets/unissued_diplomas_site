// Exhibition list in the shape of the future Strapi `Exhibition` collection.
// See docs/plans/2026-09-23-exhibitions-page-design.md for the field meanings.
// Years are placeholders (2026); `url` is filled in once venue links are known.

export const EXHIBITIONS = [
  // Australia
  { country: "AU", city: "Sydney", venue: "UNSW Sydney, Anita B. Lawrence Building", startDate: "2026-02-12", endDate: "2026-02-15", hours: "9AM–5PM" },
  { country: "AU", city: "Melbourne", venue: "Sir Louis Matheson Library (Level 1)", startDate: "2026-06-14", dateNote: "TBA" },

  // Germany
  { country: "DE", city: "Hannover", venue: "Ernst-August-Platz", startDate: "2026-02-25", hours: "12AM–5PM" },
  { country: "DE", city: "Hannover", venue: "New City Hall", startDate: "2026-02-26", hours: "8AM–12AM" },
  { country: "DE", city: "Hannover", venue: "State Parliament of Lower Saxony", startDate: "2026-02-26", hours: "12:30AM–5PM" },

  // Canada
  { country: "CA", city: "Waterloo", venue: "University of Waterloo", startDate: "2026-03-15", hours: "9AM–5PM" },
  { country: "CA", city: "Toronto", venue: "Hart House, University of Toronto", startDate: "2026-02-24", endDate: "2026-03-22" },
  { country: "CA", city: "Ottawa", venue: "University of Ottawa", startDate: "2026-02-26", endDate: "2026-02-27" },
  // source: Feb 28 – 29 (no Feb 29 in 2026)
  { country: "CA", city: "Vancouver", venue: "Kwantlen Polytechnic University", startDate: "2026-02-28", endDate: "2026-03-01" },
  { country: "CA", city: "London", venue: "The University of Western Ontario", startDate: "2026-02-26", endDate: "2026-03-11" },
  { country: "CA", city: "Montréal", venue: "Université de Montréal", startDate: "2026-02-28", endDate: "2026-03-05" },
  { country: "CA", city: "Edmonton", venue: "University of Alberta", startDate: "2026-02-26", endDate: "2026-03-15", dateNote: "mid-Mar" },
  { country: "CA", city: "Toronto", venue: "University of Toronto", startDate: "2026-03-04", endDate: "2026-03-11" },

  // Finland
  { country: "FI", city: "Helsinki", venue: "University of Helsinki", startDate: "2026-02-24" },

  // Sweden
  { country: "SE", city: "Stockholm", venue: "Nansen Academy", startDate: "2026-02-22", endDate: "2026-02-26" },

  // Belgium
  { country: "BE", city: "Brussels", venue: "Station Europe (EU Parliament)", startDate: "2026-02-23", endDate: "2026-03-01" },
  { country: "BE", city: "Brussels", venue: "ELF", startDate: "2026-03-11", endDate: "2026-03-13" },
  { country: "BE", city: "Bruges", venue: "College of Europe", startDate: "2026-03-13", endDate: "2026-03-16" },

  // Czechia
  { country: "CZ", city: "Prague", venue: "NYU Prague", startDate: "2026-04-03", endDate: "2026-04-17" },
  { country: "CZ", city: "Načeradec", venue: "The Cumorah Academy", startDate: "2026-02-24", endDate: "2026-02-26" },
  { country: "CZ", city: "Pardubice", venue: "University of Pardubice", startDate: "2026-05-03", endDate: "2026-05-26" },

  // Netherlands
  { country: "NL", city: "The Hague", venue: "City Hall (Atrium)", startDate: "2026-05-06", endDate: "2026-05-16" },

  // France
  { country: "FR", city: "Paris", venue: "Maison Internationale, Cité Internationale Universitaire de Paris (+10 locations)", startDate: "2026-02-14", endDate: "2026-03-03", hours: "Mon–Sun 7AM–10PM" },
  { country: "FR", city: "Menton", venue: "Sciences Po Paris, Menton campus", startDate: "2026-02-27", dateNote: "ongoing" },

  // Ukraine
  { country: "UA", city: "Kyiv", venue: "National University of Kyiv-Mohyla Academy", startDate: "2026-02-23", endDate: "2026-03-23", hours: "9AM–9PM" },
  { country: "UA", city: "Ternopil", venue: "Ternopil National Medical University", startDate: "2026-02-22", endDate: "2026-03-22" },
  { country: "UA", city: "Chernivtsi", venue: "Yuriy Fedkovych Chernivtsi National University", startDate: "2026-04-01", endDate: "2026-04-16" },
  { country: "UA", city: "Kyiv", venue: "Vadym Hetman Kyiv National Economic University", startDate: "2026-02-26", endDate: "2026-03-23" },
  { country: "UA", city: "Khmelnytskyi", venue: "Khmelnytskyi National University", startDate: "2026-06-26", endDate: "2026-07-10" },
  { country: "UA", city: "Uzhhorod", venue: "Uzhhorod National University", startDate: "2026-09-03", endDate: "2026-09-07" },
  { country: "UA", city: "Irshava", venue: "Irshava Historical and Local Lore Museum", startDate: "2026-09-26", endDate: "2026-10-31" },

  // South Korea
  { country: "KR", city: "Seoul", venue: "Square near the russian embassy (during the protest of the Ukrainian community)", startDate: "2026-02-24", hours: "2PM–5:30PM" },
  { country: "KR", city: "Goyang", venue: "Gallery Sansu", startDate: "2026-06-29" },

  // Norway
  { country: "NO", city: "Lillehammer", venue: "Nansen Academy", startDate: "2026-02-26", endDate: "2026-04-03" },
  { country: "NO", city: "Tromsø", venue: "The Arctic University of Norway", startDate: "2026-02-26", endDate: "2026-03-04" },

  // Lithuania
  { country: "LT", city: "Vilnius", venue: "Vilnius University", startDate: "2026-02-26", endDate: "2026-03-10" },
  { country: "LT", city: "Vilnius", venue: "Ukrainian Centre", startDate: "2026-02-24", endDate: "2026-03-29" },
  { country: "LT", city: "Kaunas", venue: "Kauno Santaros gimnazija", startDate: "2026-02-26", endDate: "2026-03-03" },
  { country: "LT", city: "Kaunas", venue: "Kaunas University of Technology, KTU Main Library (2nd floor)", startDate: "2026-03-01", endDate: "2026-03-17" },

  // Bulgaria
  { country: "BG", city: "Blagoevgrad", venue: "American University in Bulgaria", startDate: "2026-02-26", endDate: "2026-03-05", hours: "9AM–5PM" },

  // Denmark
  { country: "DK", city: "Aarhus", venue: "Aarhus University", startDate: "2026-02-22", endDate: "2026-03-15" },

  // Spain
  { country: "ES", city: "Seville", venue: "Loyola University", startDate: "2026-04-04" },

  // Japan
  { country: "JP", city: "Tokyo", venue: "Tokyo University, Komaba Library", startDate: "2026-02-19", endDate: "2026-03-04", hours: "9AM–5PM (see details)" },
  { country: "JP", city: "Tokyo", venue: "Temple University, “The Parliament” Lounge", startDate: "2026-02-22" },

  // United States
  { country: "US", city: "New York", venue: "Ukrainian Institute", startDate: "2026-02-24" },
  { country: "US", city: "Cleveland", venue: "Cleveland State University", startDate: "2026-03-01", endDate: "2026-03-31" },
  { country: "US", city: "Hanover", venue: "Dartmouth College", startDate: "2026-03-03", endDate: "2026-04-04" },
  { country: "US", city: "Worcester, MA", venue: "Worcester Polytechnic Institute", startDate: "2026-02-27", endDate: "2026-03-01" },
  { country: "US", city: "Stanford", venue: "Stanford Law School", startDate: "2026-02-22", endDate: "2026-03-30" },
  { country: "US", city: "Vermillion", venue: "University of South Dakota", startDate: "2026-02-24", endDate: "2026-03-08" },
  { country: "US", city: "Providence", venue: "Brown University", startDate: "2026-02-24", endDate: "2026-03-02" },
  { country: "US", city: "Toledo", venue: "University of Toledo", startDate: "2026-03-11", endDate: "2026-03-31" },
  { country: "US", city: "Annandale-on-Hudson", venue: "Bard College", startDate: "2026-02-24", endDate: "2026-03-03" },
  { country: "US", city: "Storrs Mansfield", venue: "Babbidge Library at UConn", startDate: "2026-02-19", endDate: "2026-03-04" },
  { country: "US", city: "Annandale-on-Hudson", venue: "Fisher Studio Arts Building", startDate: "2026-02-24", endDate: "2026-03-03" },
  { country: "US", city: "Boston", venue: "Boston University", startDate: "2026-02-26", endDate: "2026-03-02" },
  { country: "US", city: "Cambridge, MA", venue: "Massachusetts Institute of Technology", startDate: "2026-02-26", dateNote: "ongoing" },
  { country: "US", city: "Montezuma, NM", venue: "UWC-USA", startDate: "2026-02-23", endDate: "2026-02-27" },
  { country: "US", city: "Middlebury, VT", venue: "Middlebury College, Davis Family Library Display", startDate: "2026-02-24", endDate: "2026-03-05" },
  // source: Feb 29 – Mar 12 (no Feb 29 in 2026)
  { country: "US", city: "Waltham", venue: "Brandeis University", startDate: "2026-03-01", endDate: "2026-03-12" },

  // Qatar
  { country: "QA", city: "Al Rayyan", venue: "Georgetown University, Atrium", startDate: "2026-04-21", endDate: "2026-05-04" },

  // Indonesia
  { country: "ID", city: "Denpasar, Bali", venue: "Honorary Consulate of Ukraine in Denpasar", startDate: "2026-02-24" },

  // Taiwan
  { country: "TW", city: "Taipei", venue: "Taipei National University of the Arts", startDate: "2026-04-30", endDate: "2026-05-17" },
  { country: "TW", city: "Hualien", venue: "Tzu Chi University", startDate: "2026-05-27", endDate: "2026-06-08" },

  // Slovakia
  { country: "SK", city: "Bratislava", venue: "Ukrajinský Inštitút", startDate: "2026-02-24", endDate: "2026-03-11" },
  { country: "SK", city: "Bratislava", venue: "Námestie Nežnej revolúcie", startDate: "2026-02-24" },
  { country: "SK", city: "Bratislava", venue: "Univerzita Komenského", startDate: "2026-03-15", endDate: "2026-03-28" },

  // Ireland
  { country: "IE", city: "Kerry", venue: "Munster Technological University, Kerry (North Campus) Library", startDate: "2026-02-26", endDate: "2026-03-15", hours: "Mon–Wed 9AM–9PM, Thu–Fri 9AM–5PM, Sat 10AM–2PM" },
  { country: "IE", city: "Cork", venue: "MTU Arena", startDate: "2026-04-04", endDate: "2026-04-19", hours: "Mon–Fri 7AM–10PM, Sat–Sun 9AM–5PM" },
  // source year: 2025
  { country: "IE", city: "Cork", venue: "The Boole Library, University College Cork", startDate: "2026-01-27", endDate: "2026-02-27" },
  { country: "IE", city: "Limerick", venue: "Glucksman Library, University of Limerick", startDate: "2026-02-17", endDate: "2026-03-10" },

  // United Kingdom
  { country: "GB", city: "Belfast", venue: "Ulster University", startDate: "2026-02-22", endDate: "2026-02-26" },
  { country: "GB", city: "St Andrews", venue: "University of St Andrews, Main Library", startDate: "2026-02-19", endDate: "2026-02-25" },
  { country: "GB", city: "Oxford", venue: "University of Oxford", startDate: "2026-02-20" },
  { country: "GB", city: "London", venue: "Goodenough College", startDate: "2026-02-22", endDate: "2026-02-24" },
  { country: "GB", city: "London", venue: "King's College London", startDate: "2026-02-26", endDate: "2026-03-05" },
  { country: "GB", city: "Aberdeen", venue: "University of Aberdeen", startDate: "2026-02-24", endDate: "2026-03-01" },
  { country: "GB", city: "Egham", venue: "Royal Holloway, University of London", startDate: "2026-02-24", endDate: "2026-03-02" },
  { country: "GB", city: "St Donats", venue: "St Donat's Castle, UWC Atlantic College", startDate: "2026-02-26", endDate: "2026-03-04" },
  { country: "GB", city: "Glasgow", venue: "University of Strathclyde", startDate: "2026-02-22", endDate: "2026-02-24" },
  { country: "GB", city: "Nottingham", venue: "Nottingham Trent University", startDate: "2026-02-24" },
  { country: "GB", city: "Colchester", venue: "University of Essex", startDate: "2026-02-23" },
  { country: "GB", city: "Brighton", venue: "University of Sussex", startDate: "2026-03-11", endDate: "2026-03-23" },

  // Nigeria
  { country: "NG", city: "Maiduguri", venue: "Federal University of Maiduguri and the CATAI HUB Center for Advocacy, Transparency and Accountability Initiative", startDate: "2026-02-23", endDate: "2026-03-26" },
  // source date partly hidden in the screenshot ("…r 3")
  { country: "NG", city: "Maiduguri", venue: "Borno State University", startDate: "2026-03-03" },

  // Poland
  { country: "PL", city: "Kraków", venue: "Jagiellonian University", startDate: "2026-03-14", endDate: "2026-03-21" },

  // Estonia
  { country: "EE", city: "Tallinn", venue: "Tallinn University", startDate: "2026-02-24", endDate: "2026-03-11" },

  // Romania
  { country: "RO", city: "Cluj-Napoca", venue: "Colegiul Academic", startDate: "2026-02-26", endDate: "2026-03-11" },
];

// Map geometry: ISO alpha-2 → TopoJSON numeric id (countries-110m.json) + marker coordinates.
export const COUNTRY_GEO = {
  AU: { id: "036", coordinates: [133.78, -25.27] },
  BE: { id: "056", coordinates: [4.47, 50.5] },
  BG: { id: "100", coordinates: [25.49, 42.73] },
  CA: { id: "124", coordinates: [-106.35, 56.13] },
  CZ: { id: "203", coordinates: [15.47, 49.82] },
  DE: { id: "276", coordinates: [10.45, 51.16] },
  DK: { id: "208", coordinates: [9.5, 56.26] },
  EE: { id: "233", coordinates: [25.01, 58.6] },
  ES: { id: "724", coordinates: [-3.75, 40.46] },
  FI: { id: "246", coordinates: [25.75, 61.92] },
  FR: { id: "250", coordinates: [2.21, 46.23] },
  GB: { id: "826", coordinates: [-3.44, 55.38] },
  ID: { id: "360", coordinates: [113.92, -0.79] },
  IE: { id: "372", coordinates: [-8.24, 53.41] },
  JP: { id: "392", coordinates: [138.25, 36.2] },
  KR: { id: "410", coordinates: [127.77, 35.91] },
  LT: { id: "440", coordinates: [23.88, 55.17] },
  NG: { id: "566", coordinates: [8.68, 9.08] },
  NL: { id: "528", coordinates: [5.29, 52.13] },
  NO: { id: "578", coordinates: [8.47, 60.47] },
  PL: { id: "616", coordinates: [19.15, 51.92] },
  QA: { id: "634", coordinates: [51.18, 25.35] },
  RO: { id: "642", coordinates: [24.97, 45.94] },
  SE: { id: "752", coordinates: [18.64, 60.13] },
  SK: { id: "703", coordinates: [19.7, 48.67] },
  TW: { id: "158", coordinates: [120.96, 23.7] },
  UA: { id: "804", coordinates: [31.16, 48.38] },
  US: { id: "840", coordinates: [-95.71, 37.09] },
};
