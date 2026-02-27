import type { CardActionEmitter } from "../../interfaces/emitter/card-action-emitter.interface";
import type { CardPolicy } from "../../interfaces/policy/card-policy.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ReorderCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardPolicy: CardPolicy,
    private cardActionEmit: CardActionEmitter,
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

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.cardActionEmit.emitCardReordered(members, card);
  };
}
