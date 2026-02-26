import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (boardId: string, userId: string) => {
    await this.uow.withTransaction(async () => {
      const board = await this.boardRepo.getByIdAfterEnsuringOwner(
        boardId,
        userId,
      );

      await this.boardRepo.remove(board);
      await this.memberRepo.removeAllMembersOfBoard(board);
    });
  };
}
