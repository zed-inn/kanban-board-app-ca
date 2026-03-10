import { VO } from "@domain/value-object/base.vo";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { EntityValidationError } from "@errors/entity-validation.error";

export class BoardName extends VO<string> {
  protected readonly __type!: "BoardName";
  protected readonly value: string;

  constructor(name: string) {
    super();
    if (typeof name !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_BOARD_NAME",
        "Board name must be a string.",
      );
    if ((name = name.trim()).length < 1)
      throw new EntityValidationError(
        "EMPTY_BOARD_NAME",
        "Board name cannot be empty.",
      );
    this.value = name;
  }
}

export class Board {
  private readonly _id: BoardId;
  private _name: BoardName;
  private _ownerId: UserId;

  constructor(params: { id: string; name: string; ownerId: string }) {
    this._id = new BoardId(params.id);
    this._name = new BoardName(params.name);
    this._ownerId = new UserId(params.ownerId);
  }

  public get id() {
    return this._id;
  }
  public get ownerId() {
    return this._ownerId;
  }
  public get name() {
    return this._name;
  }

  rename(newName: BoardName) {
    this._name = newName;
  }

  transferOwnershipTo(newOwnerId: UserId) {
    if (this._ownerId.isSame(newOwnerId))
      throw new EntityValidationError(
        "TRANSFER_TO_SELF",
        "Ownership transfer to self is not allowed.",
      );

    this._ownerId = newOwnerId;
  }
}
