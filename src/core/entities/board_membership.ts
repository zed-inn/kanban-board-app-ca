export class BoardMembership {
  public boardId: string;
  public memberId: string;
  public status: "ACTIVE" | "TERMINATED";

  constructor(params: {
    boardId: string;
    memberId: string;
    status: "ACTIVE" | "TERMINATED";
  }) {
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

    if (!["ACTIVE", "TERMINATED"].includes(params.status))
      throw new Error("Invalid membership status.");

    this.status = params.status;
  }

  terminateMembership = () => {
    if (this.status === "TERMINATED")
      throw new Error("Terminated membership cannot be terminated further.");

    this.status = "TERMINATED";
  };

  addMember = (userId: string) => {
    return new BoardMembership({
      boardId: this.boardId,
      memberId: userId,
      status: "ACTIVE",
    });
  };

  removeMember = (userId: string) => {
    return new BoardMembership({
      boardId: this.boardId,
      memberId: userId,
      status: "TERMINATED",
    });
  };
}
