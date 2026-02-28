import type { Board } from "../../entities/board";
import { BoardMembership } from "../../entities/board_membership";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (board: Board, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(board.id);
    this.eventEmitter.emit({
      name: "MEMBER_LEFT",
      detail: { board: board.attrbs, memberId: userId },
      userIds: memberIds.filter((m) => m != userId),
    });
  };

  execute = async (boardId: string, memberId: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(memberId, board.id);

    const member = new BoardMembership({ boardId: board.id, memberId });
    await this.memberRepo.remove(member);

    this.emitEvents(board, memberId);
  };
}
