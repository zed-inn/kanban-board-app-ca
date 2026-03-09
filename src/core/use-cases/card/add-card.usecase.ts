import { Card } from "../../entities/card";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";
import { LexoRank } from "../../services/lexorank.service";

export class AddCard {
  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private nextPosition = async (columnId: string) => {
    const topCard = await this.cardRepo.getTopInColumn(columnId);
    return topCard
      ? LexoRank.average(topCard.attrbs.position, LexoRank.max)
      : LexoRank.average(LexoRank.min, LexoRank.max);
  };

  private emitEvents = async (card: Card, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_ADDED",
      detail: card.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (
    title: string,
    content: string | null,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const cardId = await this.idGen.generateUnique();
    const position = await this.nextPosition(columnId);

    const card = new Card({ id: cardId, title, content, position, columnId });
    await this.cardRepo.save(card);

    this.emitEvents(card, boardId, userId);
  };
}
