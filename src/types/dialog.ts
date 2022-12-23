export enum DialogTypes {
  root = "ROOT_SECTION",
  section = "SECTION",
  item = "ITEM",
}
export type AddDialog =
  | DialogTypes.item
  | DialogTypes.root
  | DialogTypes.section;
