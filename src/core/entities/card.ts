export class Card {
  private _id: string;
  private title: string;
  private content: string | null;
  private position: number;
  private columnId: string;

  constructor(params: {
    id: string;
    title: string;
    content: string | null;
    position: number;
    columnId: string;
  }) {
    if (typeof params.id !== "string") throw new Error("Invalid card id.");
    params.id = params.id.trim();
    if (params.id.length < 1) throw new Error("Card Id cannot be empty.");

    this._id = params.id;

    if (typeof params.title !== "string")
      throw new Error("Invalid card title.");
    params.title = params.title.trim();
    if (params.title.length < 1) throw new Error("Card title cannot be empty.");

    this.title = params.title;

    if (!(typeof params.content === "string" || params.content === null))
      throw new Error("Invalid card content.");

    this.content = params.content?.trim() ?? null;

    if (typeof params.position !== "number")
      throw new Error("Invalid card position.");

    this.position = params.position;

    if (typeof params.columnId !== "string")
      throw new Error("Invalid column id.");
    params.columnId = params.columnId.trim();
    if (params.columnId.length < 1)
      throw new Error("Column Id cannot be empty.");

    this.columnId = params.columnId;
  }

  public get attrbs() {
    return {
      id: this._id,
      title: this.title,
      content: this.content,
      position: this.position,
      columnId: this.columnId,
    };
  }

  public get id() {
    return this._id;
  }

  public updateBody = (params: { title?: string; content?: string | null }) => {
    if (params.title !== undefined) {
      if (typeof params.title !== "string")
        throw new Error("Invalid card title.");
      params.title = params.title.trim();
      if (params.title.length < 1)
        throw new Error("Card title cannot be empty.");

      this.title = params.title;
    }

    if (params.content !== undefined) {
      if (!(typeof params.content === "string" || params.content === null))
        throw new Error("Invalid card content.");

      this.content = params.content?.trim() ?? null;
    }
  };

  public moveTo = (position: number) => {
    if (typeof position !== "number") throw new Error("Invalid card position.");
    this.position = position;
  };

  public relocateToNewColumn = (columnId: string) => {
    if (typeof columnId !== "string") throw new Error("Invalid column id.");
    columnId = columnId.trim();
    if (columnId.length < 1) throw new Error("Column Id cannot be empty.");

    this.columnId = columnId;
  };
}
