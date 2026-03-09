import type { MemberRepository } from "../interfaces/repo/member-repository.interface";
import { NotBoardMemberError } from "../errors/board.error";

export class BoardAccessService {
  constructor(private memberRepo: MemberRepository) {}

  public readonly ensureMember = async (
    userId: string,
    boardId: string,
  ): Promise<void> => {
    if (!(await this.memberRepo.isMember(userId, boardId))) {
      throw new NotBoardMemberError();
    }
  };
}
