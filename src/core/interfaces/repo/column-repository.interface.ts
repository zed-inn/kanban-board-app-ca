import type { Column } from "../../entities/column";

export interface ColumnRepository {
  isColumnInBoard(columnId: string, boardId: string): Promise<boolean>;
  getById(id: string): Promise<Column>;
  getTopInBoard(boardId: string): Promise<Column | null>;
  getTopColumnBelowPositionInBoard(
    position: string,
    boardId: string,
  ): Promise<Column | null>;
  getBottomColumnAbovePositionInBoard(
    position: string,
    boardId: string,
  ): Promise<Column | null>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
