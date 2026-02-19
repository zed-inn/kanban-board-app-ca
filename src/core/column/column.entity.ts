import type { ColumnAttributes } from "./column.interface";

export class Column {
  public id;
  public name;
  public position;
  protected board;

  constructor(data: ColumnAttributes) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
    this.board = data.board;
  }
}
