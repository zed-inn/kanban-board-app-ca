import { NotBoardOwnerError } from "../../errors/board.error";
import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.attrbs.ownerId !== userId) throw new NotBoardOwnerError();

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);

    await this.uow.withTransaction(async () => {
      await this.boardRepo.remove(board);
      await this.memberRepo.removeAllBoardMembers(board);
    });

    this.boardActionEmit.emitBoardDeleted(members, board);
  };
}
