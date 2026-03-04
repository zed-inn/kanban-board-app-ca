import type { Board } from "../../entities/board";
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

  private emitEvents = async (
    board: Board,
    memberIds: string[],
    userId: string,
  ) => {
    this.eventEmitter.emit({
      name: "BOARD_DELETED",
      detail: board.attrbs,
      userIds: memberIds.filter((m) => m !== userId),
    });
  };

  execute = async (boardId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.attrbs.ownerId !== userId) throw new NotBoardOwnerError();

    const memberIds = await this.memberRepo.getAllBoardMemberIdsById(boardId);

    await this.uow.atomic(async () => {
      await this.boardRepo.remove(board);
      await this.memberRepo.removeAllBoardMembers(board);
    });

    this.emitEvents(board, memberIds, userId);
  };
}
