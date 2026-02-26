import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";

export class UpdateCardBody {
  constructor(
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
  ) {}

  private atleastOneParamGiven = (body: {
    title?: string;
    content?: string | null;
  }) => {
    return body.title !== undefined || body.content !== undefined;
  };

  execute = async (
    cardId: string,
    body: { title?: string; content?: string | null },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getByIdAfterEnsuringInColumn(
      cardId,
      columnId,
    );

    if (!this.atleastOneParamGiven(body)) throw new Error("Nothing to update.");
    card.updateBody(body);

    await this.cardRepo.save(card);
  };
}
