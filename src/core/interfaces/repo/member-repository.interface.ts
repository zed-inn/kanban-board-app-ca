import type { Board } from "../../entities/board";
import type { BoardMembership } from "../../entities/board_membership";

export interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  removeAllMembersOfBoard(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
