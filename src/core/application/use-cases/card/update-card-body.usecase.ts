import { BaseEvent } from "@app/events/base.event";
import { CardContent, CardTitle } from "@domain/entities/card";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { CardId } from "@domain/value-objects/card-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { ApplicationError } from "@errors/application.error";
import { CardNotInColumnError } from "@errors/card.error";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnAccessService } from "@services/column-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

export class ParamsInsufficientCardBodyUpdateError extends ApplicationError {
  readonly error = "invalid_action";
  readonly code = "PARAMS_INSUFFICIENT_CARD_BODY_UPDATE";
  constructor() {
    super("Must provide at least a title or content to update.");
  }
}

type UpdateCardBodyCommand = {
  cardId: string;
  columnId: string;
  boardId: string;
  memberId: string;
  title?: string;
  content?: string | null;
};

export class UpdateCardBody {
  constructor(
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: UpdateCardBodyCommand) {
    return {
      cardId: new CardId(cmd.cardId),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      ...(cmd.title ? { title: new CardTitle(cmd.title) } : {}),
      ...(cmd.content !== undefined
        ? { content: new CardContent(cmd.content) }
        : {}),
    };
  }

  async execute(cmd: UpdateCardBodyCommand) {
    const { boardId, cardId, columnId, memberId, content, title } =
      this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.columnId.isDifferent(columnId)) throw new CardNotInColumnError();

    if (!title && !content) throw new ParamsInsufficientCardBodyUpdateError();

    const body = {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
    };
    card.updateBody(body);

    await this.cardRepo.save(card);

    events.push(
      new CardBodyUpdatedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { cardId, newBody: { title: card.title, content: card.content } },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class CardBodyUpdatedEvent extends BaseEvent<{
  cardId: CardId;
  newBody: { title: CardTitle; content: CardContent };
}> {
  protected override _name: string = "CARD_BODY_UPDATED";
}
