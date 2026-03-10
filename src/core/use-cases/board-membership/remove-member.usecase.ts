import { BoardMembership } from "../../entities/board-membership";
import { IsBoardOwnerError } from "../../errors/board.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (boardId: string, memberId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId === memberId) throw new IsBoardOwnerError();

    await this.boardAccess.ensureMember(memberId, board.id);

    const member = new BoardMembership({ boardId: board.id, memberId });
    await this.memberRepo.remove(member);

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(board.id);
    this.eventEmitter.emit({
      name: "MEMBER_LEFT",
      detail: { board: board.data, memberId },
      userIds: memberIds.filter((m) => m != memberId),
    });
  };
}
