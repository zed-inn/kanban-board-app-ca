import { BaseEvent } from "@app/events/base.event";
import { BoardMembership } from "@domain/entities/board-membership";
import { BoardId } from "@domain/value-objects/board-id.vo";
import { UserId } from "@domain/value-objects/user-id.vo";
import { IsBoardOwnerError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { EventsOrchestrator } from "@services/event-orchestrator.service";

type RemoveMemberCommand = {
  boardId: string;
  memberId: string;
};

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardAccess: BoardAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: RemoveMemberCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
    };
  }

  async execute(cmd: RemoveMemberCommand) {
    const { boardId, memberId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId.isSame(memberId)) throw new IsBoardOwnerError();
    await this.boardAccess.ensureMember(memberId, board.id);

    const member = new BoardMembership({
      boardId: boardId.v,
      memberId: memberId.v,
    });
    await this.memberRepo.remove(member);

    events.push(
      new MemberLeftEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          memberId,
        ]),
        data: { boardId, memberId },
      }),
    );

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class MemberLeftEvent extends BaseEvent<{
  boardId: BoardId;
  memberId: UserId;
}> {
  protected override _name: string = "MEMBER_LEFT";
}
