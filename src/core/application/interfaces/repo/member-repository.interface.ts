import type { BoardMembership } from "@domain/entities/board-membership";
import type { BoardId } from "@domain/value-object/board-id.vo";

export interface MemberRepository {
  exists(membership: BoardMembership, ctx?: unknown): Promise<boolean>;
  removeAll(boardId: BoardId, ctx?: unknown): Promise<void>;
  remove(membership: BoardMembership, ctx?: unknown): Promise<void>;
  save(membership: BoardMembership, ctx?: unknown): Promise<void>;
}
