import type { UserId } from "@domain/value-objects/user-id.vo";
import type { KeysetPagination, PaginatedResult } from "./pagination";

export interface BoardReadModel {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardQuery {
  getByOwnerId(
    ownerId: UserId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardReadModel>>;
  getByMemberId(
    userId: UserId,
    pagination: KeysetPagination,
  ): Promise<PaginatedResult<BoardReadModel>>;
}
