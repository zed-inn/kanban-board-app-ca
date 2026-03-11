import { BaseEvent } from "@app/events/base.event";
import { BoardId } from "@domain/value-object/board-id.vo";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { ColumnNotInBoardError } from "@errors/column.error";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type RemoveColumnCommand = {
  columnId: string;
  boardId: string;
  memberId: string;
};

export class RemoveColumn {
  constructor(
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: RemoveColumnCommand) {
    return {
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: RemoveColumnCommand) {
    const { boardId, columnId, memberId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.boardId.isDifferent(boardId)) throw new ColumnNotInBoardError();

    await this.columnRepo.remove(column);

    events.push(
      new ColumnRemovedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { columnId },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class ColumnRemovedEvent extends BaseEvent<{ columnId: ColumnId }> {
  protected override _name: string = "COLUMN_REMOVED";
}
