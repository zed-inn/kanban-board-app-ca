import type { Card } from "../entities/card";
import type { CardRepository } from "../interfaces/repo/card-repository.interface";
import { LexoRank } from "./lexorank.service";

export class CardOrderingService {
  constructor(private cardRepo: CardRepository) {}

  async calculateAfterTop(columnId: string) {
    const cc = await this.cardRepo.getTopInColumn(columnId);
    const ccl = cc?.location;
    return LexoRank.average(ccl?.position ?? LexoRank.min, LexoRank.max);
  }

  async calculateAfterCard(card: Card) {
    const ccl = card.location;
    const nc = await this.cardRepo.getTopBelowPositionInColumn(
      ccl.position,
      ccl.columnId,
    );
    const ncl = nc?.location;
    return LexoRank.average(ccl.position, ncl?.position ?? LexoRank.max);
  }

  async calculateBeforeCard(card: Card) {
    const ccl = card.location;
    const bc = await this.cardRepo.getBottomAbovePositionInColumn(
      ccl.position,
      ccl.columnId,
    );
    const bcl = bc?.location;
    return LexoRank.average(ccl.position, bcl?.position ?? LexoRank.min);
  }
}
