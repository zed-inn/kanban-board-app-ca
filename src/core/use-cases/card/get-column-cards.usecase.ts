import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";

export class GetColumnCards {
  constructor(
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
  ) {}

  execute = async (boardId: string, columnId: string, userId: string) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const cards = await this.cardRepo.getByColumnId(columnId);

    return cards;
  };
}
