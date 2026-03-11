import { BaseEvent } from "@app/events/base.event";
import { ColumnPosition } from "@domain/entities/column";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { ColumnId } from "@domain/value-objects/column-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { ColumnNotInBoardError } from "@errors/column.error";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnOrderingService } from "@services/column-ordering.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type ReorderColumnCommand = {
  columnId: string;
  targetColumnId: string;
  boardId: string;
  memberId: string;
};

export class ReorderColumn {
  constructor(
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private columnOrderingService: ColumnOrderingService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: ReorderColumnCommand) {
    return {
      columnId: new ColumnId(cmd.columnId),
      targetColumnId: new ColumnId(cmd.targetColumnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: ReorderColumnCommand) {
    const { boardId, columnId, memberId, targetColumnId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    await this.boardAccess.ensureMember(memberId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.boardId.isDifferent(boardId)) throw new ColumnNotInBoardError();

    const targetColumn = await this.columnRepo.getById(targetColumnId);
    if (targetColumn.boardId.isDifferent(boardId))
      throw new ColumnNotInBoardError();

    const pos = targetColumn.position.isAfter(column.position)
      ? await this.columnOrderingService.calculateBeforeColumn(targetColumn)
      : await this.columnOrderingService.calculateAfterColumn(targetColumn);
    const newPosition = new ColumnPosition(pos);

    column.moveTo(newPosition);

    await this.columnRepo.save(column);

    events.push(
      new ColumnReorderedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { columnId, newPosition },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class ColumnReorderedEvent extends BaseEvent<{
  columnId: ColumnId;
  newPosition: ColumnPosition;
}> {
  protected override _name: string = "COLUMN_REORDERED";
}
