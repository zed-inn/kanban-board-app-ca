import type { Board } from "../../entities/board";
import { NotBoardOwnerError } from "../../errors/board.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (board: Board, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(board.id);
    this.eventEmitter.emit({
      name: "BOARD_OWNER_CHANGED",
      detail: board.attrbs,
      userIds: memberIds.filter((m) => m !== userId),
    });
    this.eventEmitter.emit({
      name: "BOARD_OWNERSHIP_ACQUIRED",
      detail: board.attrbs,
      userIds: [userId],
    });
  };

  execute = async (boardId: string, ownerId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.attrbs.ownerId !== ownerId) throw new NotBoardOwnerError();

    await this.memberPolicy.ensureMember(userId, board.id);
    board.transferOwnershipTo(userId);

    await this.boardRepo.save(board);

    this.emitEvents(board, userId);
  };
}
