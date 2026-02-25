import { BoardMembership } from "../../entities/board_membership";
import type { Card } from "../../entities/card";
import type { Column } from "../../entities/column";
import type { CardRepository } from "../../interfaces/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/column-repository.interface";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class ReorderCard {
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
    location: { position: number; columnId?: string },
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

    if (location.columnId) {
      const newColumn = await this.columnRepo.getById(location.columnId);
      if (!this.columnBelongsToBoard(newColumn, boardId))
        throw new Error(
          "New column does not belong to board you are member of.",
        );

      card.updateColumn(location.columnId);
    }

    const cardOnPosition = await this.cardRepo.getByPositionInColumn(
      location.position,
      location.columnId ?? columnId,
    );
    if (cardOnPosition) throw new Error("Position is already occupied.");

    card.updatePosition(location.position);

    await this.cardRepo.save(card);
  };
}
