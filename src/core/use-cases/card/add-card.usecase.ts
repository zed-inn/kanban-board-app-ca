import { Card } from "../../entities/card";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { CardRepository } from "../../interfaces/repo/card-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";
import type { BoardAccessService } from "../../services/board-access.service";
import type { CardOrderingService } from "../../services/card-ordering.service";
import type { ColumnAccessService } from "../../services/column-access.service";

export class AddCard {
  constructor(
    private idGen: IdGenerator,
    private memberRepo: MemberRepository,
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
    private cardOrderingService: CardOrderingService,
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
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const cardId = await this.idGen.generate();
    const position = await this.cardOrderingService.calculateAfterTop(columnId);

    const card = new Card({ id: cardId, title, content, position, columnId });
    await this.cardRepo.save(card);

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(boardId);
    this.eventEmitter.emit({
      name: "CARD_ADDED",
      detail: card.data,
      userIds: memberIds.filter((m) => m != userId),
    });
  };
}
