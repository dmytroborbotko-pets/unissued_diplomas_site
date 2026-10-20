// Strapi image → URL of a generated size (thumbnail 245 / small 500 / medium 750 / large 1000px), else the original
export const mediaUrl = (media, format) => media?.formats?.[format]?.url ?? media?.url;

// Multi-line text field → array of lines (ActionBlock titles, headings)
export const lines = (text) => text?.split("\n");
