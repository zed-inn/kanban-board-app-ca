import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import { LexoRank } from "../../services/lexorank.service";
import type { BoardAccessService } from "../../services/board-access.service";

export class ReorderColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    columnId: string,
    iPOColumnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    const column = await this.columnRepo.getById(columnId);
    if (column.data.boardId !== boardId) throw new ColumnNotInBoardError();

    const ipoColumn = await this.columnRepo.getById(iPOColumnId);
    if (ipoColumn.data.boardId !== boardId) throw new ColumnNotInBoardError();

    let ipoNextPosition;
    if (ipoColumn.data.position < column.data.position) {
      const belowColumn =
        await this.columnRepo.getTopColumnBelowPositionInBoard(
          ipoColumn.data.position,
          boardId,
        );
      ipoNextPosition = belowColumn ? belowColumn.data.position : LexoRank.max;
    } else {
      const aboveColumn =
        await this.columnRepo.getBottomColumnAbovePositionInBoard(
          ipoColumn.data.position,
          boardId,
        );
      ipoNextPosition = aboveColumn ? aboveColumn.data.position : LexoRank.min;
    }

    const position = LexoRank.average(ipoNextPosition, ipoColumn.data.position);
    column.moveTo(position);
    await this.columnRepo.save(column);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_REORDERED",
      detail: column.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
