import type { Card } from "../../entities/card";
import {
  CardNotInColumnError,
  ParamsInsufficientCardReorderError,
} from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import { LexoRank } from "../../services/lexorank.service";

export class ReorderCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private eventEmiter: EventEmitter,
  ) {}

  private emitEvents = async (card: Card, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmiter.emit({
      name: "CARD_REORDERED",
      detail: card.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  private getBelowPosition = async (position: string, columnId: string) => {
    const belowCard = await this.cardRepo.getTopCardBelowPositionInColumn(
      position,
      columnId,
    );

    return belowCard ? belowCard.attrbs.position : LexoRank.max;
  };

  private getAbovePosition = async (position: string, columnId: string) => {
    const aboveCard = await this.cardRepo.getBottomCardAbovePositionInColumn(
      position,
      columnId,
    );

    return aboveCard ? aboveCard.attrbs.position : LexoRank.min;
  };

  execute = async (
    cardId: string,
    location: { columnId?: string; iPOCardId?: string }, // in place of card id
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.attrbs.columnId !== columnId) throw new CardNotInColumnError();

    if (location.iPOCardId) {
      const iPOCard = await this.cardRepo.getById(location.iPOCardId);
      await this.columnPolicy.ensureColumnInBoard(
        iPOCard.attrbs.columnId,
        boardId,
      );

      const ipoNextPosition = await (
        iPOCard.attrbs.columnId !== card.attrbs.columnId ||
          iPOCard.attrbs.position > card.attrbs.position
          ? this.getAbovePosition
          : this.getBelowPosition
      )(iPOCard.attrbs.position, iPOCard.attrbs.columnId);

      const position = LexoRank.average(
        ipoNextPosition,
        iPOCard.attrbs.position,
      );

      card.relocateToNewColumn(iPOCard.attrbs.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);

      this.emitEvents(card, boardId, userId);
    } else if (location.columnId) {
      const topCard = await this.cardRepo.getTopInColumn(location.columnId);
      const position = topCard
        ? LexoRank.average(topCard.attrbs.position, LexoRank.max)
        : LexoRank.average(LexoRank.min, LexoRank.max);

      card.relocateToNewColumn(location.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);

      this.emitEvents(card, boardId, userId);
    } else throw new ParamsInsufficientCardReorderError();
  };
}
