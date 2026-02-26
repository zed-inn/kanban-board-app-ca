import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class AddMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (boardId: string, memberId: string, userId: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      memberId,
    );

    const member = new BoardMembership({ boardId: board.id, memberId: userId });
    const isMember = await this.memberRepo.exists(member);
    if (isMember)
      throw new Error("Requested user is already a member of the board.");

    await this.memberRepo.save(member);
  };
}
