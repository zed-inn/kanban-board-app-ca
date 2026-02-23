import type { BoardRepository } from "../../interfaces/board-repository.interface";
import type { MemberRepository } from "../../interfaces/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/unit-of-work.interface";

export class DeleteBoard {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private uow: UnitOfWork,
  ) {}

  execute = async (boardId: string, userId: string) => {
    return await this.uow.withTransaction(async () => {
      const board = await this.boardRepo.getById(boardId);
      if (board.attrbs.ownerId !== userId)
        throw new Error("Invalid access by non-owner.");

      await this.boardRepo.remove(board);
      await this.memberRepo.removeMembersOfBoard(board);
    });
  };
}
