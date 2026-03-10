import type { Column } from "../../entities/column";

export interface ColumnRepository {
  existsInBoard(columnId: string, boardId: string): Promise<boolean>;
  getById(id: string): Promise<Column>;
  getTopInBoard(boardId: string): Promise<Column | null>;
  getTopBelowPositionInBoard(
    position: string,
    boardId: string,
  ): Promise<Column | null>;
  getBottomAbovePositionInBoard(
    position: string,
    boardId: string,
  ): Promise<Column | null>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
