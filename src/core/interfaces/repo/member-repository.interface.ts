import type { Board } from "../../entities/board";
import type { BoardMembership } from "../../entities/board_membership";

export interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getAllBoardMemberIdsById(boardId: string): Promise<string[]>;
  removeAllBoardMembers(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
