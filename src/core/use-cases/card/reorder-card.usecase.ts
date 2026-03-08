import type { Card } from "../../entities/card";
import {
  CardNotInColumnError,
  ParamsInsufficientCardReorderError,
} from "../../errors/card.error";
import type { CardConstant } from "../../interfaces/constants/card.constant";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardPolicy } from "../../interfaces/policy/card-policy.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderCard {
  constructor(
    private cardConstant: CardConstant,
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

  private getBelowPosition = async (position: number, columnId: string) => {
    const belowCard = await this.cardRepo.getTopCardBelowPositionInColumn(
      position,
      columnId,
    );

    const newPos = belowCard
      ? (position + belowCard.attrbs.position) / 2
      : position + this.cardConstant.POSITION_GAP;
    return newPos;
  };

  private getAbovePosition = async (position: number, columnId: string) => {
    const aboveCard = await this.cardRepo.getBottomCardAbovePositionInColumn(
      position,
      columnId,
    );

    const newPos = aboveCard
      ? (position + aboveCard.attrbs.position) / 2
      : position + this.cardConstant.POSITION_GAP;
    return newPos;
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

      const position = await (
        iPOCard.attrbs.columnId !== card.attrbs.columnId ||
          iPOCard.attrbs.position > card.attrbs.position
          ? this.getAbovePosition
          : this.getBelowPosition
      )(iPOCard.attrbs.position, iPOCard.attrbs.columnId);

      card.relocateToNewColumn(iPOCard.attrbs.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);

      this.emitEvents(card, boardId, userId);
    } else if (location.columnId) {
      const topCard = await this.cardRepo.getTopInColumn(location.columnId);
      const position = topCard
        ? topCard.attrbs.position + this.cardConstant.POSITION_GAP
        : 0;

      card.relocateToNewColumn(location.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);

      this.emitEvents(card, boardId, userId);
    } else throw new ParamsInsufficientCardReorderError();
  };
}
