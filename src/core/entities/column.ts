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
    if (typeof params.id !== "string") throw new Error("Invalid column id.");
    params.id = params.id.trim();
    if (params.id.length < 1) throw new Error("Column Id cannot be empty.");

    this.id = params.id;

    if (typeof params.name !== "string")
      throw new Error("Invalid column name.");
    params.name = params.name.trim();
    if (params.name.length < 1) throw new Error("Column name cannot be empty.");

    this.name = params.name;

    if (typeof params.position !== "number")
      throw new Error("Invalid column position.");

    this.position = params.position;

    if (typeof params.boardId !== "string")
      throw new Error("Invalid board id.");
    params.boardId = params.boardId.trim();
    if (params.boardId.length < 1) throw new Error("Board Id cannot be empty.");

    this.boardId = params.boardId;
  }

  updateName = (name: string) => {
    if (typeof name !== "string") throw new Error("Invalid column name.");
    name = name.trim();
    if (name.length < 1) throw new Error("Column name cannot be empty.");

    this.name;
  };

  updatePosition = (position: number) => {
    if (typeof position !== "number")
      throw new Error("Invalid column position.");

    this.position = position;
  };
}
