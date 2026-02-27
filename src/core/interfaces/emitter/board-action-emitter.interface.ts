import type { Board } from "../../entities/board";
import type { User } from "../../entities/user";

export interface BoardActionEmitter {
  emitOwnerChange(users: User[], board: Board): Promise<void>;
  emitOwnershipTransferredToNewOwnerById(
    userId: string,
    board: Board,
  ): Promise<void>;
  emitBoardDeleted(users: User[], board: Board): Promise<void>;
  emitBoardRenamed(users: User[], board: Board): Promise<void>;
  emitNewMemberJoined(users: User[], board: Board): Promise<void>;
  emitMembershipCreatedToNewMemberById(
    userId: string,
    board: Board,
  ): Promise<void>;
  emitMemberLeft(users: User[], board: Board): Promise<void>;
}
