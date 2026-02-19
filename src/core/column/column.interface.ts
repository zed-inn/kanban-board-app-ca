import type { Board } from "../board/board.entity";

export interface ColumnAttributes {
  id: string;
  name: string;
  position: number;
  board: Board;
}
