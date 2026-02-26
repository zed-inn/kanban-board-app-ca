export interface ColumnPolicy {
  ensureColumnInBoard(columnId: string, boardId: string): Promise<void>;
  ensureEmptyPosition(position: number, boardId: string): Promise<void>;
}
