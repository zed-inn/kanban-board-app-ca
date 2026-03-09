import type { Column } from "../../entities/column";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import { LexoRank } from "../../services/lexorank.service";

export class ReorderColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (col: Column, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_REORDERED",
      detail: col.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  private getBelowPosition = async (position: string, boardId: string) => {
    const belowColumn = await this.columnRepo.getTopColumnBelowPositionInBoard(
      position,
      boardId,
    );

    return belowColumn ? belowColumn.attrbs.position : LexoRank.max;
  };

  private getAbovePosition = async (position: string, boardId: string) => {
    const aboveColumn =
      await this.columnRepo.getBottomColumnAbovePositionInBoard(
        position,
        boardId,
      );

    return aboveColumn ? aboveColumn.attrbs.position : LexoRank.min;
  };

  execute = async (
    columnId: string,
    iPOColumnId: string, // in place of column id
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.attrbs.boardId !== boardId) throw new ColumnNotInBoardError();

    const ipoColumn = await this.columnRepo.getById(iPOColumnId);
    if (ipoColumn.attrbs.boardId !== boardId) throw new ColumnNotInBoardError();

    const ipoNextPosition = await (
      ipoColumn.attrbs.position < column.attrbs.position
        ? this.getBelowPosition
        : this.getAbovePosition
    )(ipoColumn.attrbs.position, boardId);

    const position = LexoRank.average(
      ipoNextPosition,
      ipoColumn.attrbs.position,
    );
    column.moveTo(position);
    await this.columnRepo.save(column);

    this.emitEvents(column, boardId, userId);
  };
}
