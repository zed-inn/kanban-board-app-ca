import type { ColumnId } from "@domain/value-objects/column-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface CardReadModel {
  id: string;
  title: string;
  content: string | null;
  position: string;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardQuery {
  getByColumnId(
    columnId: ColumnId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<CardReadModel>>;
}
