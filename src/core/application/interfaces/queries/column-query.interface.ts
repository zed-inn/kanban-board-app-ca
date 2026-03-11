import type { BoardId } from "@domain/value-objects/board-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface ColumnModel {
  id: string;
  name: string;
  position: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnQuery {
  getByBoardId(
    boardId: BoardId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<ColumnModel>>;
}
