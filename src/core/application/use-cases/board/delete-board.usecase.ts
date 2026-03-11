import { BaseEvent } from "@app/events/base.event";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { NotBoardOwnerError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "@interfaces/utils/unit-of-work.interface";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type DeleteBoardCommand = {
  boardId: string;
  userId: string;
};

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: DeleteBoardCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      userId: new UserId(cmd.userId),
    };
  }

  async execute(cmd: DeleteBoardCommand) {
    const { boardId, userId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId.isDifferent(userId)) throw new NotBoardOwnerError();

    await this.uow.atomic(async (ctx) => {
      await this.boardRepo.remove(board, ctx);
      await this.memberRepo.removeAll(boardId, ctx);
    });

    events.push(
      new BoardDeletedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          userId,
        ]),
        data: { boardId },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class BoardDeletedEvent extends BaseEvent<{ boardId: BoardId }> {
  protected override _name: string = "BOARD_DELETED";
}
