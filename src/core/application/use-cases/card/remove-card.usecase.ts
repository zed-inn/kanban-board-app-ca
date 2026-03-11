import { BaseEvent } from "@app/events/base.event";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { CardId } from "@domain/value-objects/card-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { CardNotInColumnError } from "@errors/card.error";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnAccessService } from "@services/column-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type RemoveCardCommand = {
  cardId: string;
  columnId: string;
  boardId: string;
  memberId: string;
};

export class RemoveCard {
  constructor(
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: RemoveCardCommand) {
    return {
      cardId: new CardId(cmd.cardId),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: RemoveCardCommand) {
    const { boardId, cardId, columnId, memberId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.columnId.isDifferent(columnId)) throw new CardNotInColumnError();

    await this.cardRepo.remove(card);

    events.push(
      new CardRemovedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { cardId },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class CardRemovedEvent extends BaseEvent<{ cardId: CardId }> {
  protected override _name: string = "CARD_REMOVED";
}
