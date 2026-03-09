import { Column } from "../../entities/column";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";
import { LexoRank } from "../../services/lexorank.service";
import type { BoardAccessService } from "../../services/board-access.service";

export class AddColumn {
  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (name: string, boardId: string, userId: string) => {
    await this.boardAccess.ensureMember(userId, boardId);
    const columnId = await this.idGen.generateUnique();
    const topColumn = await this.columnRepo.getTopInBoard(boardId);

    const position = topColumn
      ? LexoRank.average(topColumn.data.position, LexoRank.max)
      : LexoRank.average(LexoRank.min, LexoRank.max);

    const column = new Column({ id: columnId, name, boardId, position });
    await this.columnRepo.save(column);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_ADDED",
      detail: column.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
