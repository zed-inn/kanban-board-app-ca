import type { Column } from "../../entities/column";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export type ColumnReadModel = Column["toJSON"] & Record<string, unknown>;

export interface ColumnQuery {
  getByBoardId(
    boardId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<ColumnReadModel>>;
}
