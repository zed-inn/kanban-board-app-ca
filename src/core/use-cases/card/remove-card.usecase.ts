import type { CardActionEmitter } from "../../interfaces/emitter/card-action-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardActionEmit: CardActionEmitter,
  ) {}

  execute = async (
    cardId: string,
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
    await this.cardRepo.remove(card);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.cardActionEmit.emitCardRemoved(members, card);
  };
}
