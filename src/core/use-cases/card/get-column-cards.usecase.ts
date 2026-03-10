import type { CardQuery } from "../../interfaces/queries/card-query.interface";
import type { KeysetPagination } from "../../interfaces/queries/pagination";
import type { BoardAccessService } from "../../services/board-access.service";
import type { ColumnAccessService } from "../../services/column-access.service";

export class GetColumnCards {
  constructor(
    private cardQuery: CardQuery,
    private columnAccess: ColumnAccessService,
    private boardAccess: BoardAccessService,
  ) {}

  execute = async (
    boardId: string,
    columnId: string,
    userId: string,
    pagination: KeysetPagination,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    return this.cardQuery.getByColumnId(columnId, pagination);
  };
}
