export class Column {
  public id: string;
  public name: string;
  public position: number;
  public boardId: string;

  constructor(params: {
    id: string;
    name: string;
    position: number;
    boardId: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.position = params.position;
    this.boardId = params.boardId;
  }
}
