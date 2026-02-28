import { Column } from "../../entities/column";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddColumn {
  private readonly POSITION_STEP = 40;

  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private nextPosition = async (boardId: string) => {
    const topColumn = await this.columnRepo.getTopInBoard(boardId);
    return topColumn ? topColumn.attrbs.position + this.POSITION_STEP : 0;
  };

  private emitEvents = async (col: Column, boardId: string, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "COLUMN_ADDED",
      detail: col.attrbs,
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (name: string, boardId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const columnId = await this.idGen.generateUnique();
    const position = await this.nextPosition(boardId);

    const column = new Column({ id: columnId, name, boardId, position });
    await this.columnRepo.save(column);

    this.emitEvents(column, boardId, userId);
  };
}
