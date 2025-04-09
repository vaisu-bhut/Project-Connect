export const PREDEFINED_TAGS = [
  "Tech",
  "Creative",
  "Leadership",
  "Finance",
  "Healthcare",
  "Marketing",
  "Sales",
] as const;

export type TagType = typeof PREDEFINED_TAGS[number]; 