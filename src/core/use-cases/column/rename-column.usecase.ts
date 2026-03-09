import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class RenameColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    columnId: string,
    name: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    const column = await this.columnRepo.getById(columnId);
    if (column.data.boardId !== boardId) throw new ColumnNotInBoardError();

    column.rename(name);
    await this.columnRepo.save(column);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_RENAMED",
      detail: column.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
