import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";

export class GetBoardColumns {
  constructor(
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const columns = this.columnRepo.getByBoardId(boardId);

    return columns;
  };
}
