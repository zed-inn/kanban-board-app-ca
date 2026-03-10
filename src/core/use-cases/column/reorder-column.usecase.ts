import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import type { ColumnOrderingService } from "../../services/column-ordering.service";

export class ReorderColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private columnOrderingService: ColumnOrderingService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    columnId: string,
    targetColumnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    const cl = column.location;
    if (cl.boardId !== boardId) throw new ColumnNotInBoardError();

    const targetColumn = await this.columnRepo.getById(targetColumnId);
    const tcl = targetColumn.location;
    if (tcl.boardId !== boardId) throw new ColumnNotInBoardError();

    const newPosition =
      tcl.position > cl.position
        ? await this.columnOrderingService.insertBeforeColumn(targetColumn)
        : await this.columnOrderingService.insertAfterColumn(targetColumn);

    column.moveTo(newPosition);
    await this.columnRepo.save(column);

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_REORDERED",
      detail: column.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
