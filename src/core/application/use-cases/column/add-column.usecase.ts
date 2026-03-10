import { Column, ColumnName } from "@domain/entities/column";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { IdGenerator } from "@interfaces/utils/id-generator.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnOrderingService } from "@services/column-ordering.service";

type AddColumnCommand = {
  name: string;
  boardId: string;
  memberId: string;
};

export class AddColumn {
  constructor(
    private idGen: IdGenerator,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private columnOrderingService: ColumnOrderingService,
  ) {}

  private serialize(cmd: AddColumnCommand) {
    return {
      name: new ColumnName(cmd.name),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: AddColumnCommand) {
    const { boardId, memberId, name } = this.serialize(cmd);

    await this.boardAccess.ensureMember(memberId, boardId);

    const columnId = await this.idGen.generate();
    const position =
      await this.columnOrderingService.calculateAfterTop(boardId);

    const column = new Column({
      id: columnId,
      name: name.v,
      boardId: boardId.v,
      position,
    });
    await this.columnRepo.save(column);
  }
}
