import type { Board } from "../entities/board";
import type { BoardMembership } from "../entities/board_membership";

export interface MemberRepository {
  save(membership: BoardMembership): Promise<void>;
  removeMembersOfBoard(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  membershipExists(membership: BoardMembership): Promise<boolean>;
}
