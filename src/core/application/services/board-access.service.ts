import { BoardMembership } from "@domain/entities/board-membership";
import type { BoardId } from "@domain/value-object/board-id.vo";
import type { UserId } from "@domain/value-object/user-id.vo";
import { NotBoardMemberError } from "@errors/board.error";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";

export class BoardAccessService {
  constructor(private memberRepo: MemberRepository) {}

  public readonly ensureMember = async (
    userId: UserId,
    boardId: BoardId,
  ): Promise<void> => {
    const membership = new BoardMembership({
      memberId: userId.v,
      boardId: boardId.v,
    });
    if (!(await this.memberRepo.exists(membership))) {
      throw new NotBoardMemberError();
    }
  };
}
