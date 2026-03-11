import { UserId } from "@domain/value-objects/user-id.vo";
import type { BoardQuery } from "@interfaces/queries/board-query.interface";
import type { KeysetPagination } from "@interfaces/queries/pagination";

type GetMemberBoardsCommand = {
  memberId: string;
  pagination: KeysetPagination;
};

export class GetMemberBoards {
  constructor(private boardQuery: BoardQuery) {}

  private serialize(cmd: GetMemberBoardsCommand) {
    return { ...cmd, memberId: new UserId(cmd.memberId) };
  }

  async execute(cmd: GetMemberBoardsCommand) {
    const { pagination, memberId } = this.serialize(cmd);

    return this.boardQuery.getByMemberId(memberId, pagination);
  }
}
