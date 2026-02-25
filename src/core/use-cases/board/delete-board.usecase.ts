import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";

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
        throw new Error(
          "Board cannot be deleted without ownership priviledges.",
        );

      await this.boardRepo.remove(board);
      await this.memberRepo.removeAllMembersOfBoard(board);
    });
  };
}
