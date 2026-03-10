import type { Board } from "../../entities/board";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export type BoardReadModel = Board["toJSON"] & Record<string, unknown>;

export interface BoardQuery {
  getByOwnerId(
    ownerId: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardReadModel>>;
  getByMemberId(
    id: string,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardReadModel>>;
}
