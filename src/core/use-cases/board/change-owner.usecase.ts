import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, ownerId: string, userId: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringOwner(
      boardId,
      ownerId,
    );

    await this.memberPolicy.ensureMember(userId, board.id);
    board.transferOwnershipTo(userId);

    await this.boardRepo.save(board);
  };
}
