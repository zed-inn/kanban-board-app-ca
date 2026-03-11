import { BaseEvent } from "@app/events/base.event";
import { ColumnName } from "@domain/entities/column";
import { BoardId } from "@domain/value-object/board-id.vo";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { ColumnNotInBoardError } from "@errors/column.error";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { EventsOrchestrator } from "@services/event-basket.service";

type RenameColumnCommand = {
  columnId: string;
  name: string;
  boardId: string;
  memberId: string;
};

export class RenameColumn {
  constructor(
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: RenameColumnCommand) {
    return {
      columnId: new ColumnId(cmd.columnId),
      name: new ColumnName(cmd.name),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: RenameColumnCommand) {
    const { boardId, columnId, memberId, name } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.boardId.isDifferent(boardId)) throw new ColumnNotInBoardError();

    column.rename(name);

    await this.columnRepo.save(column);

    events.push(
      new ColumnRenamedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { columnId, newName: name },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class ColumnRenamedEvent extends BaseEvent<{
  columnId: ColumnId;
  newName: ColumnName;
}> {
  protected override _name: string = "COLUMN_RENAMED";
}
