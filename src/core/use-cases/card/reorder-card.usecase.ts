import {
  CardNotInColumnError,
  ParamsInsufficientCardReorderError,
} from "../../errors/card.error";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import { LexoRank } from "../../services/lexorank.service";
import type { BoardAccessService } from "../../services/board-access.service";

export class ReorderCard {
  constructor(
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    cardId: string,
    location: { columnId?: string; ipoCardId?: string },
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    if (!(await this.columnRepo.isColumnInBoard(columnId, boardId)))
      throw new ColumnNotInBoardError();

    const card = await this.cardRepo.getById(cardId);
    if (card.data.columnId !== columnId) throw new CardNotInColumnError();

    if (location.ipoCardId) {
      const ipoCard = await this.cardRepo.getById(location.ipoCardId);
      if (
        !(await this.columnRepo.isColumnInBoard(ipoCard.data.columnId, boardId))
      )
        throw new ColumnNotInBoardError();

      let ipoNextPosition;
      if (
        ipoCard.data.columnId !== card.data.columnId ||
        ipoCard.data.position > card.data.position
      ) {
        const aboveCard =
          await this.cardRepo.getBottomCardAbovePositionInColumn(
            ipoCard.data.position,
            ipoCard.data.columnId,
          );
        ipoNextPosition = aboveCard ? aboveCard.data.position : LexoRank.min;
      } else {
        const belowCard = await this.cardRepo.getTopCardBelowPositionInColumn(
          ipoCard.data.position,
          ipoCard.data.columnId,
        );
        ipoNextPosition = belowCard ? belowCard.data.position : LexoRank.max;
      }

      const position = LexoRank.average(ipoNextPosition, ipoCard.data.position);
      card.relocateToNewColumn(ipoCard.data.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);
    } else if (location.columnId) {
      if (!(await this.columnRepo.isColumnInBoard(location.columnId, boardId)))
        throw new ColumnNotInBoardError();
      const topCard = await this.cardRepo.getTopInColumn(location.columnId);

      const position = topCard
        ? LexoRank.average(topCard.data.position, LexoRank.max)
        : LexoRank.average(LexoRank.min, LexoRank.max);

      card.relocateToNewColumn(location.columnId);
      card.moveTo(position);
      this.cardRepo.save(card);
    } else throw new ParamsInsufficientCardReorderError();

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_REORDERED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
