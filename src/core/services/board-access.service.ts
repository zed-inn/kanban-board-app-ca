import type { MemberRepository } from "../interfaces/repo/member-repository.interface";
import { NotBoardMemberError } from "../errors/board.error";
import { BoardMembership } from "../entities/board-membership";

export class BoardAccessService {
  constructor(private memberRepo: MemberRepository) {}

  public readonly ensureMember = async (
    userId: string,
    boardId: string,
  ): Promise<void> => {
    const membership = new BoardMembership({ memberId: userId, boardId });
    if (!(await this.memberRepo.exists(membership))) {
      throw new NotBoardMemberError();
    }
  };
}
