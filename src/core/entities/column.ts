import { EntityValidationError } from "../errors/entity-validation.error";

export class Column {
  private readonly _id: string;
  private name: string;
  private position: string;
  private boardId: string;

  private static readonly validate = {
    id: (id: string): string => {
      if (typeof id !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_COLUMN_ID",
          "Column id must be a string.",
        );
      if ((id = id.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_COLUMN_ID",
          "Column id cannot be empty.",
        );
      return id;
    },
    name: (name: string): string => {
      if (typeof name !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_COLUMN_NAME",
          "Column name must be a string.",
        );
      if ((name = name.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_COLUMN_NAME",
          "Column name cannot be empty.",
        );
      return name;
    },
    position: (pos: string): string => {
      if (typeof pos !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_COLUMN_POSITION",
          "Column position must be a string.",
        );
      if ((pos = pos.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_COLUMN_POSITION",
          "Column position cannot be empty.",
        );
      return pos;
    },
    boardId: (id: string): string => {
      if (typeof id !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_BOARD_ID",
          "Board id must be a string.",
        );
      if ((id = id.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_BOARD_ID",
          "Board id cannot be empty.",
        );
      return id;
    },
  };

  constructor(params: {
    id: string;
    name: string;
    position: string;
    boardId: string;
  }) {
    this._id = Column.validate.id(params.id);
    this.name = Column.validate.name(params.name);
    this.position = Column.validate.position(params.position);
    this.boardId = Column.validate.boardId(params.boardId);
  }

  public get data() {
    return { name: this.name };
  }
  public get location() {
    return { position: this.position, boardId: this.boardId };
  }
  public get id() {
    return this._id;
  }
  public get toJSON() {
    return { id: this._id, ...this.data, ...this.location };
  }

  public readonly rename = (name: string) => {
    this.name = Column.validate.name(name);
  };

  public readonly moveTo = (position: string) => {
    this.position = Column.validate.position(position);
  };
}
