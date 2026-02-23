export class BoardMembership {
  private boardId: string;
  private memberId: string;

  constructor(params: { boardId: string; memberId: string }) {
    if (typeof params.boardId !== "string")
      throw new Error("Invalid board id.");
    params.boardId = params.boardId.trim();
    if (params.boardId.length < 1) throw new Error("Board id cannot be empty.");

    this.boardId = params.boardId;

    if (typeof params.memberId !== "string")
      throw new Error("Invalid member id.");
    params.memberId = params.memberId.trim();
    if (params.memberId.length < 1)
      throw new Error("Member id cannot be empty.");

    this.memberId = params.memberId;
  }

  public get attrbs() {
    return { boardId: this.boardId, memberId: this.memberId };
  }
}
