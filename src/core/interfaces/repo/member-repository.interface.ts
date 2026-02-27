import type { Board } from "../../entities/board";
import type { BoardMembership } from "../../entities/board_membership";
import type { User } from "../../entities/user";

export interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getAllMembersOfBoardById(boardId: string): Promise<User[]>;
  removeAllMembersOfBoard(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
