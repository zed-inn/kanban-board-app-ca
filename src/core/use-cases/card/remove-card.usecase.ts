import type { Card } from "../../entities/card";
import { CardNotInColumnError } from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (card: Card, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_REMOVED",
      detail: card.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (
    cardId: string,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.attrbs.columnId !== columnId) throw new CardNotInColumnError();

    await this.cardRepo.remove(card);

    this.emitEvents(card, boardId, userId);
  };
}
