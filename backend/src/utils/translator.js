import brandMapping from "#config/mapping.js";

export const normalizePrice = (rawPrice) => {
  if (!rawPrice) return 0;
  const numeric = parseFloat(rawPrice.replace(/[^\d.]/g, ''));
  return rawPrice.includes('万') ? numeric * 10000 : numeric;
};

export const normalizeMileage = (rawMileage) => {
  if (!rawMileage || rawMileage.includes('不明')) return 0;
  const numeric = parseFloat(rawMileage.replace(/[^\d.]/g, ''));
  return rawMileage.includes('万') ? numeric * 10000 : numeric;
};

export const translateBrand = (rawBrand) => {
  // Убираем лишние пробелы и ищем в словаре
  const clean = rawBrand?.trim();
  return brandMapping[clean] || clean || 'Unknown';
};