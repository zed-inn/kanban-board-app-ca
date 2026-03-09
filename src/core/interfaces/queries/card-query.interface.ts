import type { KeysetPagination, PaginatedResult } from "./pagination";

export type CardReadModel = {
  id: string;
  title: string;
  content: string | null;
  position: string;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CardQuery {
  getByColumnId(
    columnId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<CardReadModel>>;
}
