import {
  CardNotInColumnError,
  ParamsInsufficientCardBodyUpdateError,
} from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import type { ColumnAccessService } from "../../services/column-access.service";

export class UpdateCardBody {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    cardId: string,
    body: { title?: string; content?: string | null },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.location.columnId !== columnId) throw new CardNotInColumnError();

    if (body.title === undefined && body.content === undefined)
      throw new ParamsInsufficientCardBodyUpdateError();

    card.updateBody(body);
    await this.cardRepo.save(card);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_BODY_UPDATED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
