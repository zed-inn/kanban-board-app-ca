export interface ColumnPolicy {
  ensureColumnInBoard(columnId: string, boardId: string): Promise<void>;
  ensureEmptyPositionInBoard(position: number, boardId: string): Promise<void>;
}
