import { CardNotInColumnError } from "../../errors/card.error";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class RemoveCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    cardId: string,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    if (!(await this.columnRepo.isColumnInBoard(columnId, boardId)))
      throw new ColumnNotInBoardError();

    const card = await this.cardRepo.getById(cardId);
    if (card.data.columnId !== columnId) throw new CardNotInColumnError();

    await this.cardRepo.remove(card);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_REMOVED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
