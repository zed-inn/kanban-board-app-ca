import { Card } from "../../entities/card";
import { ColumnNotInBoardError } from "../../errors/column.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "../../interfaces/repo/column-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";
import { LexoRank } from "../../services/lexorank.service";
import type { BoardAccessService } from "../../services/board-access.service";

export class AddCard {
  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private columnRepo: ColumnRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (
    title: string,
    content: string | null,
    columnId: string,
    boardId: string,
    userId: string,
  ) => {
    await this.boardAccess.ensureMember(userId, boardId);
    if (!(await this.columnRepo.isColumnInBoard(columnId, boardId)))
      throw new ColumnNotInBoardError();

    const cardId = await this.idGen.generateUnique();
    const topCard = await this.cardRepo.getTopInColumn(columnId);

    const position = topCard
      ? LexoRank.average(topCard.data.position, LexoRank.max)
      : LexoRank.average(LexoRank.min, LexoRank.max);

    const card = new Card({ id: cardId, title, content, position, columnId });
    await this.cardRepo.save(card);

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);
    this.eventEmitter.emit({
      name: "CARD_ADDED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
