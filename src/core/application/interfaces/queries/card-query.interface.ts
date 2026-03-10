import type { ColumnId } from "@domain/value-object/column-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface CardModel extends Record<string, unknown> {}

export interface CardQuery {
  getByColumnId(
    columnId: ColumnId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<CardModel>>;
}
