import type { KeysetPagination, PaginatedResult } from "./pagination";

export type BoardReadModel = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface BoardQuery {
  getByOwnerId(
    ownerId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardQuery>>;
  getByMemberId(
    id: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardQuery>>;
}
