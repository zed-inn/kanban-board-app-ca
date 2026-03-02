import type { Card } from "../../entities/card";
import { CardNotInColumnError } from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardPolicy } from "../../interfaces/policy/card-policy.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardPolicy: CardPolicy,
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

  private getInPlaceLocationOf = async (cardId: string) => {
    const belowCard = await this.cardRepo.getById(cardId);
    const aboveCard = await this.cardRepo.getTopCardBelowPositionInColumn(
      belowCard.attrbs.position,
      belowCard.attrbs.columnId,
    );

    const belowPosition = belowCard.attrbs.position,
      abovePosition = aboveCard ? aboveCard.attrbs.position : 0;
    const position = (belowPosition + abovePosition) / 2;
    return { position, columnId: belowCard.attrbs.columnId };
  };

  execute = async (
    cardId: string,
    iPOCardId: string, // in place of card id
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.attrbs.columnId !== columnId) throw new CardNotInColumnError();

    const iPOCard = await this.cardRepo.getById(iPOCardId);
    await this.columnPolicy.ensureColumnInBoard(
      iPOCard.attrbs.columnId,
      boardId,
    );

    const location = await this.getInPlaceLocationOf(iPOCardId);

    if (location.columnId !== columnId) {
      await this.columnPolicy.ensureColumnInBoard(location.columnId, boardId);
      card.relocateToNewColumn(location.columnId);
    }

    await this.cardPolicy.ensureEmptyPositionInColumn(
      location.position,
      columnId,
    );
    card.moveTo(location.position);

    await this.cardRepo.save(card);

    this.emitEvents(card, boardId, userId);
  };
}
