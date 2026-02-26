import { BoardMembership } from "../../entities/board_membership";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, memberId: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(memberId, board.id);

    const member = new BoardMembership({ boardId: board.id, memberId });
    await this.memberRepo.remove(member);
  };
}
