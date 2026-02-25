import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class UpdateBoardName {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (boardId: string, userId: string, name: string) => {
    const membership = new BoardMembership({ boardId, memberId: userId });
    const isMember = await this.memberRepo.exists(membership);

    if (!isMember)
      throw new Error("Non-member of board cannot update name of the board.");

    const board = await this.boardRepo.getById(boardId);
    board.updateName(name);
    await this.boardRepo.save(board);
  };
}
