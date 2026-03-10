import { ColumnPostion } from "@domain/entities/column";
import { BoardId } from "@domain/value-object/board-id.vo";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { ColumnNotInBoardError } from "@errors/column.error";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnOrderingService } from "@services/column-ordering.service";

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

    await this.boardAccess.ensureMember(memberId, boardId);

    const column = await this.columnRepo.getById(columnId);
    if (column.boardId.isDifferent(boardId)) throw new ColumnNotInBoardError();

    const targetColumn = await this.columnRepo.getById(targetColumnId);
    if (targetColumn.boardId.isDifferent(boardId))
      throw new ColumnNotInBoardError();

    const pos = targetColumn.position.isAfter(column.position)
      ? await this.columnOrderingService.calculateBeforeColumn(targetColumn)
      : await this.columnOrderingService.calculateAfterColumn(targetColumn);
    const newPosition = new ColumnPostion(pos);

    column.moveTo(newPosition);

    await this.columnRepo.save(column);
  }
}
