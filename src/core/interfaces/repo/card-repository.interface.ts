import type { Card } from "../../entities/card";

export interface CardRepository {
  getByColumnId(columnId: string): Promise<Card[]>;
  getById(id: string): Promise<Card>;
  getTopInColumn(columnId: string): Promise<Card | null>;
  getTopCardBelowPositionInColumn(
    position: string,
    columnId: string,
  ): Promise<Card | null>;
  getBottomCardAbovePositionInColumn(
    position: string,
    columnId: string,
  ): Promise<Card | null>;
  remove(card: Card): Promise<void>;
  save(card: Card): Promise<void>;
}
