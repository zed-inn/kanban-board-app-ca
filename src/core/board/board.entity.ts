import type { BoardAttributes } from "./board.interface";

export class Board {
  public id;
  public name;
  protected owner;
  protected members;

  constructor(data: BoardAttributes) {
    this.id = data.id;
    this.name = data.name;
    this.owner = data.owner;
    this.members = data.members;
  }
}
