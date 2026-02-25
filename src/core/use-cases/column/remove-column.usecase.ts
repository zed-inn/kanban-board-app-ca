import { BoardMembership } from "../../entities/board_membership";
import type { Column } from "../../entities/column";
import type { ColumnRepository } from "../../interfaces/column-repository.interface";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class RemoveColumn {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
  ) {}

  private belongsToBoard = (column: Column, boardId: string) =>
    column.attrbs.boardId === boardId;

  execute = async (columnId: string, boardId: string, userId: string) => {
    const member = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(member);

    if (!isMember)
      throw new Error("Non-members of a board cannot remove columns.");

    const column = await this.columnRepo.getById(columnId);

    if (!this.belongsToBoard(column, boardId))
      throw new Error("Requested board does not have requested column.");

    await this.columnRepo.remove(column);
  };
}
