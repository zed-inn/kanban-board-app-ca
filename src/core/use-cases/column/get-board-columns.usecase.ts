import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class GetBoardColumns {
  constructor(
    private columnRepo: ColumnRepository,
    private boardAcess: BoardAccessService,
  ) {}

  execute = async (boardId: string, userId: string) => {
    await this.boardAcess.ensureMember(userId, boardId);

    const columns = this.columnRepo.getByBoardId(boardId);

    return columns;
  };
}
