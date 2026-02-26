import type { Board } from "../../entities/board";

export interface BoardRepository {
  getById(id: string): Promise<Board>;
  getByIdAfterEnsuringOwner(id: string, ownerId: string): Promise<Board>;
  getByIdAfterEnsuringMember(id: string, memberId: string): Promise<Board>;
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
