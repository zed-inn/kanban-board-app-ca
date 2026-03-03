import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";

export class GetOwnedBoards {
  constructor(private boardRepo: BoardRepository) {}

  execute = async (userId: string) => {
    const boards = await this.boardRepo.getByOwnerId(userId);

    return boards;
  };
}
