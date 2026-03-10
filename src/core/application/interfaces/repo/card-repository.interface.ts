import type { Card, CardPosition } from "@domain/entities/card";
import type { CardId } from "@domain/value-object/card-id.vo";
import type { ColumnId } from "@domain/value-object/column-id.vo";

export interface CardRepository {
  getById(id: CardId, ctx?: unknown): Promise<Card>;
  getTopInColumn(id: ColumnId, ctx?: unknown): Promise<Card | null>;
  getTopBelowPositionInColumn(
    pos: CardPosition,
    id: ColumnId,
    ctx?: unknown,
  ): Promise<Card | null>;
  getBottomAbovePositionInColumn(
    pos: CardPosition,
    id: ColumnId,
    ctx?: unknown,
  ): Promise<Card | null>;
  remove(card: Card, ctx?: unknown): Promise<void>;
  save(card: Card, ctx?: unknown): Promise<void>;
}
