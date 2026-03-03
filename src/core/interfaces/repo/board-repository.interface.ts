import type { Board } from "../../entities/board";

export interface BoardRepository {
  getByOwnerId(userId: string): Promise<Board[]>;
  getByIds(ids: string[]): Promise<Board[]>;
  getById(id: string): Promise<Board>;
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
