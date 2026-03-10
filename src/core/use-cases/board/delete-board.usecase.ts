import { NotBoardOwnerError } from "../../errors/board.error";
import type { EventEmitter } from "../../interfaces/emitter/event-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private eventEmitter: EventEmitter,
  ) {}

  execute = async (boardId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId !== userId) throw new NotBoardOwnerError();

    const memberIds = await this.memberRepo.getAllMemberIdsByBoardId(board.id);

    await this.uow.atomic(async () => {
      await this.boardRepo.remove(board);
      await this.memberRepo.removeAll(board.id);
    });

    this.eventEmitter.emit({
      name: "BOARD_DELETED",
      detail: board.data,
      userIds: memberIds.filter((m) => m !== userId),
    });
  };
}
