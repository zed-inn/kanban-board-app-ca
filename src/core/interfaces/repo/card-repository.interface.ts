import type { Card } from "../../entities/card";

export interface CardRepository {
  getById(id: string): Promise<Card>;
  getByIdAfterEnsuringInColumn(id: string, columnId: string): Promise<Card>;
  getByPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<Card | null>;
  getNextEmptyPositionInColumn(
    columnId: string,
    positionStep: number,
  ): Promise<number>;
  remove(card: Card): Promise<void>;
  save(card: Card): Promise<void>;
}
