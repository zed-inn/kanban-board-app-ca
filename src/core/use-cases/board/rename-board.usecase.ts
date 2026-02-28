import type { Board } from "../../entities/board";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RenameBoard {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private eventEmitter: EventEmitter,
  ) {}

  private emitEvents = async (board: Board, userId: string) => {
    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(board.id);
    this.eventEmitter.emit({
      name: "BOARD_RENAMED",
      detail: board.attrbs,
      userIds: memberIds.filter((m) => m !== userId),
    });
  };

  execute = async (boardId: string, userId: string, name: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(userId, board.id);

    board.rename(name);
    await this.boardRepo.save(board);

    this.emitEvents(board, userId);
  };
}
