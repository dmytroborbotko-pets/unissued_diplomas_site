// Strapi image → URL of a generated size (thumbnail 245 / small 500 / medium 750 / large 1000px), else the original
export const mediaUrl = (media, format) => media?.formats?.[format]?.url ?? media?.url;

