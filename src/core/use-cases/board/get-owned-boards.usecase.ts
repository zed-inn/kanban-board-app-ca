import type { BoardQuery } from "../../interfaces/queries/board-query.interface";
import type { KeysetPagination } from "../../interfaces/queries/pagination";

export class GetOwnedBoards {
  constructor(private boardQuery: BoardQuery) {}

  execute = async (userId: string, pagination: KeysetPagination) => {
    return await this.boardQuery.getByOwnerId(userId, pagination);
  };
}
