export interface CardPolicy {
  ensureEmptyPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<void>;
}
