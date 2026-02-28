import type { Column } from "../../entities/column";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (col: Column, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_REMOVED",
      detail: col.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (columnId: string, boardId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.attrbs.boardId !== boardId) throw new ColumnNotInBoardError();

    await this.columnRepo.remove(column);

    this.emitEvents(column, boardId, userId);
  };
}
