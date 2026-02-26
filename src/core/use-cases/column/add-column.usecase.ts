import { Column } from "../../entities/column";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddColumn {
  private readonly POSITION_STEP = 40;

  constructor(
    private idGen: IdGenerator,
    private columnRepo: ColumnRepository,
    private memberPolicy: MemberPolicy,
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
  };
}
