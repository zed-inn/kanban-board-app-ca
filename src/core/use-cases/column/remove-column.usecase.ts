import { ColumnNotInBoardError } from "../../errors/column.error";
import type { ColumnActionEmitter } from "../../interfaces/emitter/column-action-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private columnActionEmit: ColumnActionEmitter,
  ) {}

  execute = async (columnId: string, boardId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.attrbs.boardId !== boardId) throw new ColumnNotInBoardError();

    await this.columnRepo.remove(column);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.columnActionEmit.emitColumnRemoved(members, column);
  };
}
