import type { Column } from "../../entities/column";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { ColumnConstants } from "../../interfaces/constants/column.constant";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderColumn {
  constructor(
    private columnConstant: ColumnConstants,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
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

  private getBelowPosition = async (position: number, boardId: string) => {
    const belowColumn = await this.columnRepo.getTopColumnBelowPositionInBoard(
      position,
      boardId,
    );

    const newPos = belowColumn
      ? (position + belowColumn.attrbs.position) / 2
      : position + this.columnConstant.POSITION_GAP;
    return newPos;
  };

  private getAbovePosition = async (position: number, boardId: string) => {
    const aboveColumn =
      await this.columnRepo.getBottomColumnAbovePositionInBoard(
        position,
        boardId,
      );

    const newPos = aboveColumn
      ? (position + aboveColumn.attrbs.position) / 2
      : position + this.columnConstant.POSITION_GAP;
    return newPos;
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

    const position = await (
      ipoColumn.attrbs.position < column.attrbs.position
        ? this.getBelowPosition
        : this.getAbovePosition
    )(ipoColumn.attrbs.position, boardId);

    column.moveTo(position);
    await this.columnRepo.save(column);

    this.emitEvents(column, boardId, userId);
  };
}
