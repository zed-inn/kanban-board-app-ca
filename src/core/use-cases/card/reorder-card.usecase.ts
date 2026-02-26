import type { CardPolicy } from "../../interfaces/policy/card-policy.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";

export class ReorderCard {
  constructor(
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardPolicy: CardPolicy,
  ) {}

  execute = async (
    cardId: string,
    location: { position: number; columnId?: string },
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

    if (location.columnId) {
      await this.columnPolicy.ensureColumnInBoard(location.columnId, boardId);
      card.relocateToNewColumn(location.columnId);
    }

    await this.cardPolicy.ensureEmptyPositionInColumn(
      location.position,
      columnId,
    );
    card.moveTo(location.position);

    await this.cardRepo.save(card);
  };
}
