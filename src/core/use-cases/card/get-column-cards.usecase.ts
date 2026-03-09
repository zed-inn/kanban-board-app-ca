import { ColumnNotInBoardError } from "../../errors/column.error";
import type { CardQuery } from "../../interfaces/queries/card-query.interface";
import type { KeysetPagination } from "../../interfaces/queries/pagination";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class GetColumnCards {
  constructor(
    private cardQuery: CardQuery,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
  ) {}

  execute = async (
    boardId: string,
    columnId: string,
    userId: string,
    pagination: KeysetPagination,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    if (!(await this.columnRepo.isColumnInBoard(columnId, boardId))) {
      throw new ColumnNotInBoardError();
    }

    return this.cardQuery.getByColumnId(columnId, pagination);
  };
}
