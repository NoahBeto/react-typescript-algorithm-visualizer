import {
  EGenericCellType,
  TCoords,
  TGenericCellConstructor,
} from "./types/GenericCell.types";

export class GenericCell {
  private position: TCoords;
  private type!: EGenericCellType;
  private walkable!: boolean;

  constructor(args: TGenericCellConstructor) {
    this.position = args.position;
    this.setType(args.type);
  }

  toString = (): string => {
    return `(${this.position.x}-${this.position.y})`;
  };

  getPosition = (): TCoords => {
    return this.position;
  };

  getType = (): EGenericCellType => {
    if (!this.type) {
      throw new Error("cell has no type");
    }
    return this.type;
  };

  setType = (type: EGenericCellType) => {
    this.type = type;

    if (this.type === EGenericCellType.WALL) this.walkable = false;
    else this.walkable = true;
  };

  isWalkable = (): boolean => {
    return this.type !== EGenericCellType.WALL;
  };
}
