import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";

export class RenameColumn {
  constructor(
    private memberPolicy: MemberPolicy,
    private columnRepo: ColumnRepository,
  ) {}

  execute = async (
    columnId: string,
    name: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getByIdAfterEnsuringInBoard(
      columnId,
      boardId,
    );
    column.rename(name);

    await this.columnRepo.save(column);
  };
}
