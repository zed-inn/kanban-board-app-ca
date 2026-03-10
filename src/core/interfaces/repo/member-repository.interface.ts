import type { BoardMembership } from "../../entities/board-membership";

export interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getAllMemberIdsByBoardId(boardId: string): Promise<string[]>;
  removeAll(boardId: string): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
