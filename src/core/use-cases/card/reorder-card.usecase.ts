import {
  CardNotInColumnError,
  ParamsInsufficientCardReorderError,
} from "../../errors/card.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import { CardOrderingService } from "../../services/card-ordering.service";
import type { ColumnAccessService } from "../../services/column-access.service";

export class ReorderCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private cardOrderService: CardOrderingService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    cardId: string,
    target: { columnId?: string; cardId?: string },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    const cl = card.location;
    if (cl.columnId !== columnId) throw new CardNotInColumnError();

    if (target.cardId) {
      const tc = await this.cardRepo.getById(target.cardId);
      const tcl = tc.location;
      await this.columnAccess.ensureColumnInBoard(tcl.columnId, boardId);

      const newPosition =
        tcl.columnId !== columnId || tcl.position > cl.position
          ? await this.cardOrderService.calculateBeforeCard(tc)
          : await this.cardOrderService.calculateAfterCard(tc);

      card.relocateToNewColumn(tcl.columnId);
      card.moveTo(newPosition);
      this.cardRepo.save(card);
    } else if (target.columnId) {
      await this.columnAccess.ensureColumnInBoard(target.columnId, boardId);

      const newPosition = await this.cardOrderService.calculateAfterTop(
        target.columnId,
      );

      card.relocateToNewColumn(target.columnId);
      card.moveTo(newPosition);
      this.cardRepo.save(card);
    } else throw new ParamsInsufficientCardReorderError();

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(boardId);
    this.eventEmitter.emit({
      name: "CARD_REORDERED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
