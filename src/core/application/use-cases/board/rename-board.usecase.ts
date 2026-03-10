import { BoardName } from "@domain/entities/board";
import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";

type RenameBoardCommand = {
  boardId: string;
  memberId: string;
  name: string;
};

export class RenameBoard {
  constructor(
    private boardRepo: BoardRepository,
    private boardAccess: BoardAccessService,
  ) {}

  private serialize(cmd: RenameBoardCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      name: new BoardName(cmd.name),
    };
  }

  async execute(cmd: RenameBoardCommand) {
    const { boardId, memberId, name } = this.serialize(cmd);

    const board = await this.boardRepo.getById(boardId);
    await this.boardAccess.ensureMember(memberId, boardId);

    board.rename(name);

    await this.boardRepo.save(board);
  }
}
