import type { Column } from "@domain/entities/column";
import type { BoardId } from "@domain/value-objects/board-id.vo";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import { LexoRank } from "@services/lexorank.service";

export class ColumnOrderingService {
  constructor(private columnRepo: ColumnRepository) {}

  async calculateAfterTop(boardId: BoardId) {
    const cc = await this.columnRepo.getTopInBoard(boardId);
    return LexoRank.average(cc?.position.v ?? LexoRank.min, LexoRank.max);
  }

  async calculateAfterColumn(column: Column) {
    const nc = await this.columnRepo.getTopBelowPositionInBoard(
      column.position,
      column.boardId,
    );
    return LexoRank.average(column.position.v, nc?.position.v ?? LexoRank.max);
  }

  async calculateBeforeColumn(column: Column) {
    const bc = await this.columnRepo.getBottomAbovePositionInBoard(
      column.position,
      column.boardId,
    );
    return LexoRank.average(bc?.position.v ?? LexoRank.min, LexoRank.max);
  }
}
