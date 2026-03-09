import type { KeysetPagination, PaginatedResult } from "./pagination";

export type ColumnReadModel = {
  id: string;
  name: string;
  position: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ColumnQuery {
  getByBoardId(
    boardId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<ColumnReadModel>>;
}
