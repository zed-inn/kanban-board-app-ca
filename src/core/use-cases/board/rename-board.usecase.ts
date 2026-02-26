import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";

export class UpdateBoardName {
  constructor(
    private boardRepo: BoardRepository,
    private memberPolicy: MemberPolicy,
  ) {}

  execute = async (boardId: string, memberId: string, name: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(memberId, board.id);

    board.updateName(name);
    await this.boardRepo.save(board);
  };
}
