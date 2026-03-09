import { EntityValidationError } from "../errors/entity-validation.error";

export class BoardMembership {
  private readonly _boardId: string;
  private readonly _memberId: string;

  private static readonly validate = {
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
    memberId: (id: string): string => {
      if (typeof id !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_MEMBER_ID",
          "Member id must be a string.",
        );
      if ((id = id.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_MEMBER_ID",
          "Member id cannot be empty.",
        );
      return id;
    },
  };

  constructor(params: { boardId: string; memberId: string }) {
    this._boardId = BoardMembership.validate.boardId(params.boardId);
    this._memberId = BoardMembership.validate.memberId(params.memberId);
  }

  public get boardId() {
    return this._boardId;
  }
  public get memberId() {
    return this._memberId;
  }
}
