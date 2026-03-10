import { ColumnNotInBoardError } from "../errors/column.error";
import type { ColumnRepository } from "../interfaces/repo/column-repository.interface";

export class ColumnAccessService {
  constructor(private columnRepo: ColumnRepository) {}

  public async ensureColumnInBoard(
    columnId: string,
    boardId: string,
  ): Promise<void> {
    if (!(await this.columnRepo.existsInBoard(columnId, boardId))) {
      throw new ColumnNotInBoardError();
    }
  }
}
