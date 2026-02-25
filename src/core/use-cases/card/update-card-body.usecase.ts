import { BoardMembership } from "../../entities/board_membership";
import type { Card } from "../../entities/card";
import type { Column } from "../../entities/column";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class UpdateCardBody {
  constructor(
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private cardRepo: CardRepository,
  ) {}

  private columnBelongsToBoard = (column: Column, boardId: string) =>
    column.attrbs.boardId === boardId;

  private belongsToColumn = (card: Card, columnId: string) =>
    card.attrbs.columnId === columnId;

  execute = async (
    cardId: string,
    body: { title?: string; content?: string | null },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    const member = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(member);
    if (!isMember)
      throw new Error(
        "Non-member cannot update body of cards in column of a board.",
      );

    const column = await this.columnRepo.getById(columnId);
    if (!this.columnBelongsToBoard(column, boardId))
      throw new Error("Requested board does not have requested column.");

    const card = await this.cardRepo.getById(cardId);
    if (!this.belongsToColumn(card, columnId))
      throw new Error("Requested column does not have requested card.");

    card.updateBody(body);
    await this.cardRepo.save(card);
  };
}
