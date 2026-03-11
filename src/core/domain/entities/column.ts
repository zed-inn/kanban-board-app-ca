import { EntityValidationError } from "@errors/entity-validation.error";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { Position } from "@domain/value-objects/position.vo";
import { VO } from "@domain/value-objects/base.vo";

export class ColumnName extends VO<string> {
  protected readonly __type!: "ColumnName";
  protected readonly value: string;

  constructor(name: string) {
    super();
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
    this.value = name;
  }
}

export class ColumnPosition extends Position<"ColumnPosition"> {
  constructor(pos: string) {
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
    super(pos);
  }
}

export class Column {
  private readonly _id: ColumnId;
  private _name: ColumnName;
  private _position: ColumnPosition;
  private _boardId: BoardId;

  constructor(params: {
    id: string;
    name: string;
    position: string;
    boardId: string;
  }) {
    this._id = new ColumnId(params.id);
    this._name = new ColumnName(params.name);
    this._position = new ColumnPosition(params.position);
    this._boardId = new BoardId(params.boardId);
  }

  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public get position() {
    return this._position;
  }
  public get boardId() {
    return this._boardId;
  }

  rename(newName: ColumnName) {
    this._name = newName;
  }

  moveTo(newPosition: ColumnPosition) {
    this._position = newPosition;
  }
}
