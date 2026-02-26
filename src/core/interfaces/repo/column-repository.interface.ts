import type { Column } from "../../entities/column";

export interface ColumnRepository {
  getById(id: string): Promise<Column>;
  getByIdAfterEnsuringInBoard(id: string, boardId: string): Promise<Column>;
  getByPositionInBoard(
    position: number,
    boardId: string,
  ): Promise<Column | null>;
  getNextEmptyPositionInBoard(
    boardId: string,
    positionStep: number,
  ): Promise<number>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
