import type { ColumnQuery } from "../../interfaces/queries/column-query.interface";
import type { KeysetPagination } from "../../interfaces/queries/pagination";
import type { BoardAccessService } from "../../services/board-access.service";

export class GetBoardColumns {
  constructor(
    private columnQuery: ColumnQuery,
    private boardAccess: BoardAccessService,
  ) {}

  execute = async (
    boardId: string,
    userId: string,
    pagination: KeysetPagination,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    return this.columnQuery.getByBoardId(boardId, pagination);
  };
}
