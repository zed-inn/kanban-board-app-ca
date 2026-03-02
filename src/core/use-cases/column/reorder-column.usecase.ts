import type { Column } from "../../entities/column";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderColumn {
  constructor(
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

  private getInPlacePositionOf = async (columnId: string) => {
    const belowCol = await this.columnRepo.getById(columnId);
    const aboveCol = await this.columnRepo.getTopColumnBelowPositionInBoard(
      belowCol.attrbs.position,
      belowCol.attrbs.boardId,
    );

    const belowPosition = belowCol.attrbs.position,
      abovePosition = aboveCol ? aboveCol.attrbs.position : 0;
    const position = (belowPosition + abovePosition) / 2;
    return position;
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

    await this.columnPolicy.ensureColumnInBoard(iPOColumnId, boardId);

    const position = await this.getInPlacePositionOf(iPOColumnId);
    column.moveTo(position);

    await this.columnRepo.save(column);

    this.emitEvents(column, boardId, userId);
  };
}
