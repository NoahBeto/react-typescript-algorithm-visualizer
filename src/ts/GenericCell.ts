import {
  EGenericCellType,
  TCoords,
  TGenericCellConstructor,
} from "./types/GenericCell.types";

export class GenericCell {
  // generic attributes
  private position: TCoords;
  private type!: EGenericCellType;
  private walkable!: boolean;

  // astar attributes
  private f: number;
  private g: number;
  private h: number;
  private visited: boolean;
  private closed: boolean;
  private parent: GenericCell | undefined;
  private weight: number;

  constructor(args: TGenericCellConstructor) {
    this.position = args.position;
    this.setType(args.type);
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.weight = args.weight | 1;
  }

  getCost = (fromNeighbor: GenericCell): number => {
    if (
      fromNeighbor &&
      fromNeighbor.getPosition().x != this.position.x &&
      fromNeighbor.getPosition().y != this.position.y
    ) {
      return this.weight * 1.41421;
    }
    return this.weight;
  };

  getF = (): number => {
    return this.f;
  };

  setF = (f: number) => {
    this.f = f;
  };

  getG = (): number => {
    return this.g;
  };

  setG = (g: number) => {
    this.g = g;
  };

  getH = (): number => {
    return this.h;
  };

  setH = (h: number) => {
    this.h = h;
  };

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

  isVisited = (): boolean => {
    return this.visited;
  };

  setVisited = (is: boolean) => {
    this.visited = is;
  };

  isClosed = (): boolean => {
    return this.closed;
  };

  setClosed = (is: boolean) => {
    this.closed = is;
  };

  getParent = (): GenericCell | undefined => {
    return this.parent;
  };

  setParent = (cell: GenericCell) => {
    this.parent = cell;
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
