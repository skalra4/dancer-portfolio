/** Legacy portfolio category labels mapped to current display names. */
const CATEGORY_ALIASES: Record<string, string> = {
  Headshots: "Visual Portfolio",
};

/** Normalise a portfolio category label for display and filtering. */
export function displayCategory(category: string): string {
  const trimmed = category.trim();
  return CATEGORY_ALIASES[trimmed] ?? trimmed;
}
