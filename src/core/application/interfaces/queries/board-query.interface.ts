import type { UserId } from "@domain/value-objects/user-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface BoardModel extends Record<string, unknown> {}

export interface BoardQuery {
  getByOwnerId(
    ownerId: UserId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardModel>>;
  getByMemberId(
    userId: UserId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardModel>>;
}
