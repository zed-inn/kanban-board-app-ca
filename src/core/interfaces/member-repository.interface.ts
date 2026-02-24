import type { Board } from "../entities/board";
import type { BoardMembership } from "../entities/board_membership";

export interface MemberRepository {
  save(membership: BoardMembership): Promise<void>;
  removeAllMembersOfBoard(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  exists(membership: BoardMembership): Promise<boolean>;
}
