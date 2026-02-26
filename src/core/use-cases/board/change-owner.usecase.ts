import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, ownerId: string, memberId: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureOwner(ownerId, board.id);

    await this.memberPolicy.ensureMember(memberId, board.id);
    board.transferOwnershipTo(memberId);

    await this.boardRepo.save(board);
  };
}
