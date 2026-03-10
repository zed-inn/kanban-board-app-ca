import type { Board } from "@domain/entities/board";
import type { BoardId } from "@domain/value-object/board-id.vo";

export interface BoardRepository {
  getById(id: BoardId, ctx?: unknown): Promise<Board>;
  save(board: Board, ctx?: unknown): Promise<void>;
  remove(board: Board, ctx?: unknown): Promise<void>;
}
