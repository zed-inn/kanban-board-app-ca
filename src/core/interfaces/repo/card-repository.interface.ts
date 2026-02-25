import type { Card } from "../../entities/card";

export interface CardRepository {
  save(card: Card): Promise<void>;
  remove(card: Card): Promise<void>;
  getTopCardInColumn(columnId: string): Promise<Card | null>;
  getById(id: string): Promise<Card>;
  getByPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<Card | null>;
}
