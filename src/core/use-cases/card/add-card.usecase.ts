import { Card } from "../../entities/card";
import type { CardActionEmitter } from "../../interfaces/emitter/card-action-emitter.interface";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddCard {
  private readonly POSITION_STEP = 100;

  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardActionEmit: CardActionEmitter,
  ) {}

  private nextPosition = async (columnId: string) => {
    const topCard = await this.cardRepo.getTopInColumn(columnId);
    return topCard ? topCard.attrbs.postition + this.POSITION_STEP : 0;
  };

  execute = async (
    title: string,
    content: string | null,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.memberPolicy.ensureMember(userId, boardId);
    await this.columnPolicy.ensureColumnInBoard(columnId, boardId);

    const cardId = await this.idGen.generateUnique();
    const position = await this.nextPosition(columnId);

    const card = new Card({ id: cardId, title, content, position, columnId });
    await this.cardRepo.save(card);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.cardActionEmit.emitCardAdded(members, card);
  };
}
