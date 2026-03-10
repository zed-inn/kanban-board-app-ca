import type { Column, ColumnPostion } from "@domain/entities/column";
import type { BoardId } from "@domain/value-object/board-id.vo";
import type { ColumnId } from "@domain/value-object/column-id.vo";

export interface ColumnRepository {
  existsInBoard(
    columnId: ColumnId,
    boardId: BoardId,
    ctx?: unknown,
  ): Promise<boolean>;
  getById(id: ColumnId, ctx?: unknown): Promise<Column>;
  getTopInBoard(boardId: BoardId, ctx?: unknown): Promise<Column | null>;
  getTopBelowPositionInBoard(
    position: ColumnPostion,
    boardId: BoardId,
    ctx?: unknown,
  ): Promise<Column | null>;
  getBottomAbovePositionInBoard(
    position: ColumnPostion,
    boardId: BoardId,
    ctx?: unknown,
  ): Promise<Column | null>;
  remove(column: Column, ctx?: unknown): Promise<void>;
  save(column: Column, ctx?: unknown): Promise<void>;
}
