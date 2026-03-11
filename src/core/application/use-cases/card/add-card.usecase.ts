import { Card, CardContent, CardTitle } from "@domain/entities/card";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import type { CardOrderingService } from "../../services/card-ordering.service";
import type { ColumnAccessService } from "@services/column-access.service";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { BaseEvent } from "@app/events/base.event";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type AddCardCommand = {
  title: string;
  content: string | null;
  columnId: string;
  boardId: string;
  memberId: string;
};

export class AddCard {
  constructor(
    private idGen: IdGenerator,
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private cardOrderingService: CardOrderingService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: AddCardCommand) {
    return {
      title: new CardTitle(cmd.title),
      content: new CardContent(cmd.content),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: AddCardCommand) {
    const { boardId, columnId, content, memberId, title } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const cardId = await this.idGen.generate();
    const position = await this.cardOrderingService.calculateAfterTop(columnId);

    const card = new Card({
      id: cardId,
      title: title.v,
      content: content.v,
      position,
      columnId: columnId.v,
    });
    await this.cardRepo.save(card);

    events.push(
      new NewCardAddedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { card },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class NewCardAddedEvent extends BaseEvent<{ card: Card }> {
  protected override _name: string = "NEW_CARD_ADDED";
}
