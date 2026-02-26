import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";

export class RenameColumn {
  constructor(
    private memberPolicy: MemberPolicy,
    private columnRepo: ColumnRepository,
    private columnPolicy: ColumnPolicy,
  ) {}

  execute = async (
    columnId: string,
    name: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    await this.columnPolicy.ensureColumnInBoard(column.id, boardId);

    column.updateName(name);
    await this.columnRepo.save(column);
  };
}
