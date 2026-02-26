import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (boardId: string, memberId: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      memberId,
    );

    const member = new BoardMembership({ boardId: board.id, memberId });
    await this.memberRepo.remove(member);
  };
}
