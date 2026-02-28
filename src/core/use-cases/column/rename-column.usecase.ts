import type { Column } from "../../entities/column";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RenameColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (col: Column, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_RENAMED",
      detail: col.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (
    columnId: string,
    name: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.attrbs.boardId !== boardId) throw new ColumnNotInBoardError();

    column.rename(name);
    await this.columnRepo.save(column);

    this.emitEvents(column, boardId, userId);
  };
}
