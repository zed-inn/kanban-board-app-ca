import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";

export class BoardMembership {
  private readonly _boardId: BoardId;
  private readonly _memberId: UserId;

  constructor(params: { boardId: string; memberId: string }) {
    this._boardId = new BoardId(params.boardId);
    this._memberId = new UserId(params.memberId);
  }

  public get boardId() {
    return this._boardId;
  }
  public get memberId() {
    return this._memberId;
  }
}
