import type { Column } from "../entities/column";

export interface ColumnRepository {
  save(column: Column): Promise<void>;
  getTopColumn(): Promise<Column | null>;
  getById(id: string): Promise<Column>;
  getByPositionInBoard(
    position: number,
    boardId: string,
  ): Promise<Column | null>;
  remove(column: Column): Promise<void>;
}
