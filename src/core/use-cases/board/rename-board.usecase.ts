import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { BoardAccessService } from "../../services/board-access.service";

export class RenameBoard {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardAccess: BoardAccessService,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (boardId: string, userId: string, name: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.boardAccess.ensureMember(userId, board.id);

    board.rename(name);
    await this.boardRepo.save(board);

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(board.id);
    this.eventEmitter.emit({
      name: "BOARD_RENAMED",
      detail: board.data,
      userIds: memberIds.filter((m) => m !== userId),
    });
  };
}
