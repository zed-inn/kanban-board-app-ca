import { BaseEvent } from "@app/events/base.event";
import { BoardName } from "@domain/entities/board";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type RenameBoardCommand = {
  boardId: string;
  memberId: string;
  name: string;
};

export class RenameBoard {
  constructor(
    private boardRepo: BoardRepository,
    private boardAccess: BoardAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: RenameBoardCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      name: new BoardName(cmd.name),
    };
  }

  async execute(cmd: RenameBoardCommand) {
    const { boardId, memberId, name } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    const board = await this.boardRepo.getById(boardId);
    await this.boardAccess.ensureMember(memberId, boardId);

    board.rename(name);

    await this.boardRepo.save(board);

    events.push(
      new BoardRenamedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { boardId, newName: name },
      }),
    );
  }
}

export class BoardRenamedEvent extends BaseEvent<{
  boardId: BoardId;
  newName: BoardName;
}> {
  protected override _name: string = "BOARD_RENAMED";
}
