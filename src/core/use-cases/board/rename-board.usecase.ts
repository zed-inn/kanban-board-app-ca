import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RenameBoard {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, userId: string, name: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      userId,
    );

    board.rename(name);
    await this.boardRepo.save(board);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.boardActionEmit.emitBoardDeleted(members, board);
  };
}
