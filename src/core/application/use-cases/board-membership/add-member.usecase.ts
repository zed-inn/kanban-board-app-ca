import { BaseEvent } from "@app/events/base.event";
import { BoardMembership } from "@domain/entities/board-membership";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { IsBoardMemberError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";
import type { EventsOrchestrator } from "@services/event-basket.service";

type AddMemberCommand = {
  boardId: string;
  memberId: string;
  userId: string;
};

export class AddMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardAccess: BoardAccessService,
    private eventsOrchestra: EventsOrchestrator,
  ) {}

  private serialize(cmd: AddMemberCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.userId),
      userId: new UserId(cmd.userId),
    };
  }

  async execute(cmd: AddMemberCommand) {
    const { boardId, memberId, userId } = this.serialize(cmd);
    const events = this.eventsOrchestra.createNewBasket();

    const board = await this.boardRepo.getById(boardId);
    await this.boardAccess.ensureMember(memberId, board.id);

    const member = new BoardMembership({
      boardId: boardId.v,
      memberId: userId.v,
    });
    if (await this.memberRepo.exists(member)) throw new IsBoardMemberError();

    await this.memberRepo.save(member);

    events.pushMany([
      new NewMemberJoinedEvent({
        target: this.eventsOrchestra.createTarget.viaBoardIdExcluding(boardId, [
          userId,
          memberId,
        ]),
        data: { boardId, memberId: userId },
      }),
      new MembershipAcquiredEvent({
        target: this.eventsOrchestra.createTarget.viaUserId(userId),
        data: { boardId },
      }),
    ]);

    await this.eventsOrchestra.drainBasket(events);
  }
}

export class NewMemberJoinedEvent extends BaseEvent<{
  boardId: BoardId;
  memberId: UserId;
}> {
  protected override _name: string = "NEW_MEMBER_JOINED";
}

export class MembershipAcquiredEvent extends BaseEvent<{ boardId: BoardId }> {
  protected override _name: string = "MEMBERSHIP_ACQUIRED";
}
