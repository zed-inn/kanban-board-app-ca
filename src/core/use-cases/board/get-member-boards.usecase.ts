import type { BoardQuery } from "../../interfaces/queries/board-query.interface";
import type { KeysetPagination } from "../../interfaces/queries/pagination";

export class GetMemberBoards {
  constructor(private boardQuery: BoardQuery) {}

  execute = async (userId: string, pagination: KeysetPagination) => {
    return this.boardQuery.getByMemberId(userId, pagination);
  };
}
