import { BaseEvent } from "@app/events/base.event";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { NotBoardOwnerError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import { EventsOrchestrator } from "@services/event-orchestrator.service";

type ChangeOwnerCommand = {
  boardId: string;
  ownerId: string;
  memberId: string;
};

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private boardAccess: BoardAccessService,
    private eventOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: ChangeOwnerCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      ownerId: new UserId(cmd.ownerId),
    };
  }

  async execute(cmd: ChangeOwnerCommand) {
    const { boardId, memberId, ownerId } = this.serialize(cmd);
    const events = this.eventOrchestra.createNewBasket();

    const board = await this.boardRepo.getById(boardId);

    if (board.ownerId.isDifferent(ownerId)) throw new NotBoardOwnerError();
    await this.boardAccess.ensureMember(memberId, boardId);

    board.transferOwnershipTo(memberId);
    await this.boardRepo.save(board);

    events.pushMany([
      new BoardOwnerChangedEvent({
        target: this.eventOrchestra.createTarget.viaBoardId(boardId),
        data: { boardId, newOwnerId: ownerId },
      }),
      new BoardOwnershipAcquiredEvent({
        target: this.eventOrchestra.createTarget.viaUserId(memberId),
        data: { boardId },
      }),
    ]);

    await this.eventOrchestra.drainBasket(events);
  }
}

export class BoardOwnerChangedEvent extends BaseEvent<{
  boardId: BoardId;
  newOwnerId: UserId;
}> {
  protected override _name: string = "BOARD_OWNER_CHANGED";
}

export class BoardOwnershipAcquiredEvent extends BaseEvent<{
  boardId: BoardId;
}> {
  protected override _name: string = "BOARD_OWNERSHIP_ACQUIRED";
}
