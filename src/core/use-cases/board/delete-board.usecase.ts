import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, ownerId: string) => {
    await this.uow.withTransaction(async () => {
      const board = await this.boardRepo.getById(boardId);
      await this.memberPolicy.ensureOwner(ownerId, board.id);

      await this.boardRepo.remove(board);
      await this.memberRepo.removeAllMembersOfBoard(board);
    });
  };
}
