import type { BoardId } from "@domain/value-objects/board-id.vo";
import type { ColumnId } from "@domain/value-objects/column-id.vo";
import { ColumnNotInBoardError } from "@errors/column.error";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";

export class ColumnAccessService {
  constructor(private columnRepo: ColumnRepository) {}

  public async ensureColumnInBoard(
    columnId: ColumnId,
    boardId: BoardId,
  ): Promise<void> {
    if (!(await this.columnRepo.existsInBoard(columnId, boardId))) {
      throw new ColumnNotInBoardError();
    }
  }
}
