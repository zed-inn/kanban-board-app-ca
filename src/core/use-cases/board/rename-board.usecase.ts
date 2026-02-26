import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";

export class RenameBoard {
  constructor(private boardRepo: BoardRepository) {}

  execute = async (boardId: string, userId: string, name: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      userId,
    );

    board.rename(name);
    await this.boardRepo.save(board);
  };
}
