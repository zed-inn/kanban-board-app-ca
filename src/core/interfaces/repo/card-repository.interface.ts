import type { Card } from "../../entities/card";

export interface CardRepository {
  getById(id: string): Promise<Card>;
  getTopInColumn(columnId: string): Promise<Card | null>;
  getTopBelowPositionInColumn(
    position: string,
    columnId: string,
  ): Promise<Card | null>;
  getBottomAbovePositionInColumn(
    position: string,
    columnId: string,
  ): Promise<Card | null>;
  remove(card: Card): Promise<void>;
  save(card: Card): Promise<void>;
}
