import { BoardMembership } from "../../entities/board_membership";
import { Column } from "../../entities/column";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddColumn {
  private readonly POSITION_STEP = 40;

  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
  ) {}

  execute = async (name: string, boardId: string, userId: string) => {
    const member = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(member);

    if (!isMember)
      throw new Error("Non-member of a board cannot add columns to the board.");

    const columnId = this.idGen.generate();
    const topColumn = await this.columnRepo.getTopColumn();
    const position = topColumn
      ? topColumn.attrbs.position + this.POSITION_STEP
      : 0;

    const column = new Column({ id: columnId, name, boardId, position });
    await this.columnRepo.save(column);
  };
}
