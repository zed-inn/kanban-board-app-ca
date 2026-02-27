import {
  CardNotInColumnError,
  ParamsInsufficientCardBodyUpdateError,
} from "../../errors/card.error";
import type { CardActionEmitter } from "../../interfaces/emitter/card-action-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class UpdateCardBody {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardActionEmit: CardActionEmitter,
  ) {}

  private ensureTitleOrContentGiven = (body: {
    title?: string;
    content?: string | null;
  }) => {
    if (body.title === undefined && body.content === undefined)
      throw new ParamsInsufficientCardBodyUpdateError();
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

    const card = await this.cardRepo.getById(cardId);
    if (card.attrbs.columnId !== columnId) throw new CardNotInColumnError();

    this.ensureTitleOrContentGiven(body);
    card.updateBody(body);

    await this.cardRepo.save(card);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.cardActionEmit.emitCardBodyUpdated(members, card);
  };
}
