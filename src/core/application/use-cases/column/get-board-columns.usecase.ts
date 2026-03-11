import { BoardId } from "@domain/value-objects/board-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import type { ColumnQuery } from "@interfaces/queries/column-query.interface";
import type { KeysetPagination } from "@interfaces/queries/pagination";
import type { BoardAccessService } from "@services/board-access.service";

type GetBoardColumnsCommand = {
  boardId: string;
  memberId: string;
  pagination: KeysetPagination;
};

export class GetBoardColumns {
  constructor(
    private columnQuery: ColumnQuery,
    private boardAccess: BoardAccessService,
  ) {}

  private serialize(cmd: GetBoardColumnsCommand) {
    return {
      ...cmd,
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: GetBoardColumnsCommand) {
    const { boardId, memberId, pagination } = this.serialize(cmd);

    await this.boardAccess.ensureMember(memberId, boardId);

    return this.columnQuery.getByBoardId(boardId, pagination);
  }
}
