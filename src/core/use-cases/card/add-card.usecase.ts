import { Card } from "../../entities/card";
import type { ColumnPolicy } from "../../interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddCard {
  private readonly POSITION_STEP = 100;

  constructor(
    private idGen: IdGenerator,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
  ) {}

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
    const position = await this.cardRepo.getNextEmptyPositionInColumn(
      columnId,
      this.POSITION_STEP,
    );

    const card = new Card({ id: cardId, title, content, position, columnId });
    await this.cardRepo.save(card);
  };
}
