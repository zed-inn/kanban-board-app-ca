import { EntityValidationError } from "../errors/entity-validation.error";

export class Board {
  private readonly _id: string;
  private name: string;
  private _ownerId: string;

  private static readonly validate = {
    id: (id: string): string => {
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
    name: (name: string): string => {
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
      return name;
    },
    ownerId: (ownerId: string): string => {
      if (typeof ownerId !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_OWNER_ID",
          "Owner id must be a string.",
        );
      if ((ownerId = ownerId.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_OWNER_ID",
          "Owner id cannot be empty.",
        );
      return ownerId;
    },
  };

  constructor(params: { id: string; name: string; ownerId: string }) {
    this._id = Board.validate.id(params.id);
    this.name = Board.validate.name(params.name);
    this._ownerId = Board.validate.ownerId(params.ownerId);
  }

  public get data() {
    return { name: this.name };
  }
  public get ownerId() {
    return this._ownerId;
  }
  public get id() {
    return this._id;
  }

  public readonly rename = (name: string) => {
    this.name = Board.validate.name(name);
  };

  public readonly transferOwnershipTo = (ownerId: string) => {
    const validOwnerId = Board.validate.ownerId(ownerId);
    if (validOwnerId === this._ownerId)
      throw new EntityValidationError(
        "TRANSFER_TO_SELF",
        "Ownership transfer to self is not allowed.",
      );
    this._ownerId = validOwnerId;
  };
}
