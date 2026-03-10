import type { Column } from "../entities/column";
import type { ColumnRepository } from "../interfaces/repo/column-repository.interface";
import { LexoRank } from "./lexorank.service";

export class ColumnOrderingService {
  constructor(private columnRepo: ColumnRepository) {}

  async calculateAfterTop(columnId: string) {
    const cc = await this.columnRepo.getTopInBoard(columnId);
    const ccl = cc?.location;
    return LexoRank.average(ccl?.position ?? LexoRank.min, LexoRank.max);
  }

  async calculateAfterColumn(column: Column) {
    const ccl = column.location;
    const nc = await this.columnRepo.getTopBelowPositionInBoard(
      ccl.position,
      ccl.boardId,
    );
    const ncl = nc?.location;
    return LexoRank.average(ccl.position, ncl?.position ?? LexoRank.max);
  }

  async calculateBeforeColumn(column: Column) {
    const ccl = column.location;
    const bc = await this.columnRepo.getBottomAbovePositionInBoard(
      ccl.position,
      ccl.boardId,
    );
    const bcl = bc?.location;
    return LexoRank.average(ccl.position, bcl?.position ?? LexoRank.min);
  }
}
