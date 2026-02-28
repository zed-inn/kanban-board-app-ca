import type { Card } from "../../entities/card";
import {
  CardNotInColumnError,
  ParamsInsufficientCardBodyUpdateError,
} from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class UpdateCardBody {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private ensureTitleOrContentGiven = (body: {
    title?: string;
    content?: string | null;
  }) => {
    if (body.title === undefined && body.content === undefined)
      throw new ParamsInsufficientCardBodyUpdateError();
  };

  private emitEvents = async (card: Card, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_REORDERED",
      detail: card.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (
    cardId: string,
    body: { title?: string; content?: string | null },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.attrbs.columnId !== columnId) throw new CardNotInColumnError();

    this.ensureTitleOrContentGiven(body);
    card.updateBody(body);

    await this.cardRepo.save(card);

    this.emitEvents(card, boardId, userId);
  };
}
