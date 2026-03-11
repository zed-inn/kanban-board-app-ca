import type { Card } from "@domain/entities/card";
import type { ColumnId } from "@domain/value-objects/column-id.vo";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import { LexoRank } from "@services/lexorank.service";

export class CardOrderingService {
  constructor(private cardRepo: CardRepository) {}

  async calculateAfterTop(columnId: ColumnId) {
    const cc = await this.cardRepo.getTopInColumn(columnId);
    return LexoRank.average(cc?.position.v ?? LexoRank.min, LexoRank.max);
  }

  async calculateAfterCard(card: Card) {
    const nc = await this.cardRepo.getTopBelowPositionInColumn(
      card.position,
      card.columnId,
    );
    return LexoRank.average(card.position.v, nc?.position.v ?? LexoRank.max);
  }

  async calculateBeforeCard(card: Card) {
    const bc = await this.cardRepo.getBottomAbovePositionInColumn(
      card.position,
      card.columnId,
    );
    return LexoRank.average(bc?.position.v ?? LexoRank.min, card.position.v);
  }
}
