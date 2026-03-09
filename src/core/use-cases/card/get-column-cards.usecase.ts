import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class GetColumnCards {
  constructor(
    private columnRepo: ColumnRepository,
    private cardRepo: CardRepository,
    private boardAcess: BoardAccessService,
  ) {}

  execute = async (boardId: string, columnId: string, userId: string) => {
    await this.boardAcess.ensureMember(userId, boardId);
    await this.columnRepo.isColumnInBoard(columnId, boardId);

    const cards = await this.cardRepo.getByColumnId(columnId);

    return cards;
  };
}
