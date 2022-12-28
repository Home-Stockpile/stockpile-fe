export const DialogTypes = {
  root: "ROOT_SECTION",
  section: "SECTION",
  item: "ITEM",
} as const;

export type AddDialog =
  | DialogTypes.item
  | DialogTypes.root
  | DialogTypes.section;
