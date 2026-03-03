import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class GetMemberBoards {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (userId: string) => {
    const memberships = await this.memberRepo.getByUserId(userId);
    const boards = await this.boardRepo.getByIds(
      memberships.map((m) => m.attrbs.boardId),
    );

    return boards;
  };
}
