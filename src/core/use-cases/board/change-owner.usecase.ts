import type { Board } from "../../entities/board";
import { NotBoardOwnerError } from "../../errors/board.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (board: Board, userId: string) => {
    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(board.id);
    this.eventEmitter.emit({
      name: "BOARD_OWNER_CHANGED",
      detail: board.data,
      userIds: memberIds.filter((m) => m !== userId),
    });
    this.eventEmitter.emit({
      name: "BOARD_OWNERSHIP_ACQUIRED",
      detail: board.data,
      userIds: [userId],
    });
  };

  execute = async (boardId: string, ownerId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId !== ownerId) throw new NotBoardOwnerError();
    await this.boardAccess.ensureMember(userId, board.id);

    board.transferOwnershipTo(userId);
    await this.boardRepo.save(board);

    this.emitEvents(board, userId);
  };
}
