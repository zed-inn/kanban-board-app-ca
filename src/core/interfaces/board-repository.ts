import type { Board } from "../entities/board";

export interface BoardRepository {
  getById(id: string): Promise<Board>;
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
