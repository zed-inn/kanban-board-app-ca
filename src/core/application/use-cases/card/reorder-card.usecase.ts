import { BaseEvent } from "@app/events/base.event";
import { CardPosition } from "@domain/entities/card";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { CardId } from "@domain/value-objects/card-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { ApplicationError } from "@errors/application.error";
import { CardNotInColumnError } from "@errors/card.error";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { CardOrderingService } from "@services/card-ordering.service";
import type { ColumnAccessService } from "@services/column-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

export class ParamsInsufficientCardReorderError extends ApplicationError {
  readonly error = "invalid_action";
  readonly code = "PARAMS_INSUFFICIENT_CARD_REORDER";
  constructor() {
    super("Must provide a target columnId or ipoCardId to reorder.");
  }
}

type ReorderCardCommand = {
  cardId: string;
  columnId: string;
  boardId: string;
  memberId: string;
  targetColumnId?: string;
  targetCardId?: string;
};

export class ReorderCard {
  constructor(
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private cardOrderService: CardOrderingService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: ReorderCardCommand) {
    return {
      cardId: new CardId(cmd.cardId),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      ...(cmd.targetColumnId
        ? { targetColumnId: new ColumnId(cmd.columnId) }
        : {}),
      ...(cmd.targetCardId
        ? { targetCardId: new CardId(cmd.targetCardId) }
        : {}),
    };
  }

  async execute(cmd: ReorderCardCommand) {
    const {
      boardId,
      cardId,
      columnId,
      memberId,
      targetCardId,
      targetColumnId,
    } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.columnId.isDifferent(columnId)) throw new CardNotInColumnError();

    if (targetCardId) {
      const targetCard = await this.cardRepo.getById(targetCardId);
      await this.columnAccess.ensureColumnInBoard(targetCard.columnId, boardId);

      const pos =
        targetCard.columnId.isDifferent(columnId) ||
        targetCard.position.isAfter(card.position)
          ? await this.cardOrderService.calculateBeforeCard(targetCard)
          : await this.cardOrderService.calculateAfterCard(targetCard);
      const newPosition = new CardPosition(pos);

      card.relocateToNewColumn(targetCard.columnId);
      card.moveTo(newPosition);

      this.cardRepo.save(card);

      events.push(
        new CardReorderedEvent({
          target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(
            boardId,
            [memberId],
          ),
          data: {
            cardId,
            newPosition,
            ...(targetCard.columnId.isDifferent(card.columnId)
              ? { newColumnId: targetCard.columnId }
              : {}),
          },
        }),
      );
    } else if (targetColumnId) {
      await this.columnAccess.ensureColumnInBoard(targetColumnId, boardId);

      const pos = await this.cardOrderService.calculateAfterTop(targetColumnId);
      const newPosition = new CardPosition(pos);

      card.relocateToNewColumn(targetColumnId);
      card.moveTo(newPosition);

      this.cardRepo.save(card);

      events.push(
        new CardReorderedEvent({
          target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(
            boardId,
            [memberId],
          ),
          data: { cardId, newPosition },
        }),
      );
    } else throw new ParamsInsufficientCardReorderError();

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class CardReorderedEvent extends BaseEvent<{
  cardId: CardId;
  newColumnId?: ColumnId;
  newPosition: CardPosition;
}> {
  protected override _name: string = "CARD_REORDERED";
}
