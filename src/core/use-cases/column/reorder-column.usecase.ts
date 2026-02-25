import { BoardMembership } from "../../entities/board_membership";
import type { Column } from "../../entities/column";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
  ) {}

  private belongsToBoard = (column: Column, boardId: string) =>
    column.attrbs.boardId === boardId;

  execute = async (
    columnId: string,
    position: number,
    boardId: string,
    userId: string,
  ) => {
    const member = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(member);

    if (!isMember)
      throw new Error("Non-members of a board cannot re/order columns.");

    const column = await this.columnRepo.getById(columnId);

    if (!this.belongsToBoard(column, boardId))
      throw new Error("Requested board does not have requested column.");

    const columnOnPosition = await this.columnRepo.getByPositionInBoard(
      position,
      boardId,
    );
    if (columnOnPosition) throw new Error("Position is already occupied.");

    column.updatePosition(position);
    await this.columnRepo.save(column);
  };
}
