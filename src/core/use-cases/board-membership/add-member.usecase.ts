import type { Board } from "../../entities/board";
import { BoardMembership } from "../../entities/board-membership";
import { IsBoardMemberError } from "../../errors/board.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class AddMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (
    board: Board,
    memberId: string,
    userId: string,
  ) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(board.id);

    this.eventEmitter.emit({
      name: "NEW_MEMBER_JOINED",
      detail: { board: board.attrbs, memberId: userId },
      userIds: memberIds.filter((m) => m !== userId && m !== memberId),
    });
    this.eventEmitter.emit({
      name: "MEMBERSHIP_ACQUIRED",
      detail: board.attrbs,
      userIds: [userId],
    });
  };

  execute = async (boardId: string, memberId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(memberId, board.id);

    const member = new BoardMembership({ boardId: board.id, memberId: userId });
    if (await this.memberRepo.exists(member)) throw new IsBoardMemberError();

    await this.memberRepo.save(member);

    this.emitEvents(board, memberId, userId);
  };
}
