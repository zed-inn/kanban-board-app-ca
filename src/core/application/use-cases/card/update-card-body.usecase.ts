import { CardContent, CardTitle } from "@domain/entities/card";
import { BoardId } from "@domain/value-object/board-id.vo";
import { CardId } from "@domain/value-object/card-id.vo";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import {
  CardNotInColumnError,
  ParamsInsufficientCardBodyUpdateError,
} from "@errors/card.error";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { ColumnAccessService } from "@services/column-access.service";

type UpdateCardBodyCommand = {
  cardId: string;
  columnId: string;
  boardId: string;
  memberId: string;
  title?: string;
  content?: string | null;
};

export class UpdateCardBody {
  constructor(
    private cardRepo: CardRepository,
    private boardAccess: BoardAccessService,
    private columnAccess: ColumnAccessService,
  ) {}

  private serialize(cmd: UpdateCardBodyCommand) {
    return {
      cardId: new CardId(cmd.cardId),
      columnId: new ColumnId(cmd.columnId),
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      ...(cmd.title ? { title: new CardTitle(cmd.title) } : {}),
      ...(cmd.content !== undefined
        ? { content: new CardContent(cmd.content) }
        : {}),
    };
  }

  async execute(cmd: UpdateCardBodyCommand) {
    const { boardId, cardId, columnId, memberId, content, title } =
      this.serialize(cmd);

    await this.boardAccess.ensureMember(memberId, boardId);
    await this.columnAccess.ensureColumnInBoard(columnId, boardId);

    const card = await this.cardRepo.getById(cardId);
    if (card.columnId.isDifferent(columnId)) throw new CardNotInColumnError();

    if (!title && !content) throw new ParamsInsufficientCardBodyUpdateError();

    const body = {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
    };
    card.updateBody(body);

    await this.cardRepo.save(card);
  }
}
