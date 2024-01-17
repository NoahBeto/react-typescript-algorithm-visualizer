export type TGenericCellConstructor = {
  position: TCoords;
  type: EGenericCellType;
};

export type TGenericCell = {
  coords: TCoords;
  type: EGenericCellType;
};

export type TCoords = { x: number; y: number };

export enum EGenericCellType {
  NORMAL = "cell-normal",
  WALL = "cell-wall",
  START = "cell-start",
  FINISH = "cell-finish",
  HIGHLIGHT = "cell-highlight",
  SUBTLEHIGHLIGHT = "cell-subtle-highlight",
}
