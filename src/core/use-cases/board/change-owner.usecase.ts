import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/board-repository.interface";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (boardId: string, ownerId: string, memberId: string) => {
    const board = await this.boardRepo.getById(boardId);
    const isOwner = board.attrbs.ownerId === ownerId;

    if (!isOwner)
      throw new Error(
        "Changing owner cannot be done without ownership priviledges.",
      );

    const member = new BoardMembership({ boardId, memberId });
    const isMember = await this.memberRepo.membershipExists(member);

    if (!isMember)
      throw new Error("Only a member of the board can replace the owner.");

    board.transferOwnershipTo(memberId);

    await this.boardRepo.save(board);
  };
}
