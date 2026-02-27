import { Column } from "../../entities/column";
import type { ColumnActionEmitter } from "../../interfaces/emitter/column-action-emitter.interface";
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
    private columnActionEmit: ColumnActionEmitter,
  ) {}

  execute = async (name: string, boardId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);

    const columnId = await this.idGen.generateUnique();
    const position = await this.columnRepo.getNextEmptyPositionInBoard(
      boardId,
      this.POSITION_STEP,
    );

    const column = new Column({ id: columnId, name, boardId, position });
    await this.columnRepo.save(column);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.columnActionEmit.emitColumnAdded(members, column);
  };
}
