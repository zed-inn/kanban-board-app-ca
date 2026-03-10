import { CardNotInColumnError } from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import type { ColumnAccessService } from "../../services/column-access.service";

export class RemoveCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    cardId: string,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    const cl = card.location;
    if (cl.columnId !== columnId) throw new CardNotInColumnError();

    await this.cardRepo.remove(card);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_REMOVED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
