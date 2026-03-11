import { UserId } from "@domain/value-objects/user-id.vo";
import type { BoardQuery } from "@interfaces/queries/board-query.interface";
import type { KeysetPagination } from "@interfaces/queries/pagination";

type GetOwnedBoardsCommand = {
  ownerId: string;
  pagination: KeysetPagination;
};

export class GetOwnedBoards {
  constructor(private boardQuery: BoardQuery) {}
  private serialize(cmd: GetOwnedBoardsCommand) {
    return { ...cmd, ownerId: new UserId(cmd.ownerId) };
  }

  async execute(cmd: GetOwnedBoardsCommand) {
    const { pagination, ownerId } = this.serialize(cmd);

    return this.boardQuery.getByOwnerId(ownerId, pagination);
  }
}
