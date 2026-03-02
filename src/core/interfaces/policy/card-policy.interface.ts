export interface CardPolicy {
  ensureEmptyPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<void>;
  ensureCardInColumn(id: string, columnId: string): Promise<void>;
}
