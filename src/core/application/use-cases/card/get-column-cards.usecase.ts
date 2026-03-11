import { BoardId } from "@domain/value-objects/board-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import type { CardQuery } from "@interfaces/queries/card-query.interface";
import type { KeysetPagination } from "@interfaces/queries/pagination";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnAccessService } from "@services/column-access.service";

type GetColumnCardsCommand = {
  boardId: string;
  columnId: string;
  memberId: string;
  pagination: KeysetPagination;
};

export class GetColumnCards {
  constructor(
    private cardQuery: CardQuery,
    private columnAccess: ColumnAccessService,
    private boardAccess: BoardAccessService,
  ) {}

  private serialize(cmd: GetColumnCardsCommand) {
    return {
      ...cmd,
      memberId: new UserId(cmd.memberId),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
    };
  }

  async execute(cmd: GetColumnCardsCommand) {
    const { boardId, columnId, memberId, pagination } = this.serialize(cmd);

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    return this.cardQuery.getByColumnId(columnId, pagination);
  }
}
