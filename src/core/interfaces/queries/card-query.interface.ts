import type { Card } from "../../entities/card";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export type CardReadModel = Card["toJSON"] & Record<string, unknown>;

export interface CardQuery {
  getByColumnId(
    columnId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<CardReadModel>>;
}
