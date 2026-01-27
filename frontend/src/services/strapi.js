import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to construct query params
const buildQuery = (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.locale) queryParams.append('locale', params.locale);
  if (params.populate) queryParams.append('populate', params.populate);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}]`, value);
    });
  }

  return queryParams.toString();
};

// Generic fetch function
const fetchFromStrapi = async (endpoint, params = {}) => {
  try {
    const query = buildQuery(params);
    const url = query ? `${endpoint}?${query}` : endpoint;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Sponsors
export const getSponsors = (locale = 'en') =>
  fetchFromStrapi('/sponsors', { locale, populate: '*', sort: 'order:asc' });

// Partners
export const getPartners = (locale = 'en') =>
  fetchFromStrapi('/partners', { locale, populate: '*', sort: 'order:asc' });

// FAQs
export const getFAQs = (locale = 'en') =>
  fetchFromStrapi('/faqs', { locale, sort: 'order:asc' });

// Exhibitions (for world map)
export const getExhibitions = () =>
  fetchFromStrapi('/exhibitions', { populate: '*' });

// Achievements by year
export const getAchievements = (year, locale = 'en') =>
  fetchFromStrapi('/achievements', {
    locale,
    populate: '*',
    filters: { year: { $eq: year } }
  });

// External links
export const getLinks = (locale = 'en') =>
  fetchFromStrapi('/links', { locale, sort: 'order:asc' });

// Translations
export const getTranslations = (locale = 'en') =>
  fetchFromStrapi('/translations', { locale });

export default api;
