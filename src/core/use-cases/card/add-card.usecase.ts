import { BoardMembership } from "../../entities/board_membership";
import { Card } from "../../entities/card";
import type { Column } from "../../entities/column";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class AddCard {
  private readonly POSITION_STEP = 100;

  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private cardRepo: CardRepository,
  ) {}

  private columnBelongsToBoard = (column: Column, boardId: string) =>
    column.attrbs.boardId === boardId;

  execute = async (
    title: string,
    content: string | null,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    const member = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(member);
    if (!isMember)
      throw new Error("Non-member cannot add cards in column of a board.");

    const column = await this.columnRepo.getById(columnId);
    if (!this.columnBelongsToBoard(column, boardId))
      throw new Error("Requested board does not have requested column.");

    const cardId = this.idGen.generate();

    const topCard = await this.cardRepo.getTopCardInColumn(column.attrbs.id);
    const position = topCard
      ? topCard.attrbs.postition + this.POSITION_STEP
      : 0;

    const card = new Card({ id: cardId, title, content, position, columnId });

    await this.cardRepo.save(card);
  };
}
