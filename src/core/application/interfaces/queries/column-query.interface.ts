import type { BoardId } from "@domain/value-object/board-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface ColumnModel extends Record<string, unknown> {}

export interface ColumnQuery {
  getByBoardId(
    boardId: BoardId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<ColumnModel>>;
}
