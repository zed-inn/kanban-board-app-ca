import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { NotBoardOwnerError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { BoardAccessService } from "@services/board-access.service";

type ChangeOwnerCommand = {
  boardId: string;
  ownerId: string;
  memberId: string;
};

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private boardAccess: BoardAccessService,
  ) {}

  private serialize(cmd: ChangeOwnerCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      memberId: new UserId(cmd.memberId),
      ownerId: new UserId(cmd.ownerId),
    };
  }

  async execute(cmd: ChangeOwnerCommand) {
    const { boardId, memberId, ownerId } = this.serialize(cmd);

    const board = await this.boardRepo.getById(boardId);

    if (board.ownerId.isDifferent(ownerId)) throw new NotBoardOwnerError();
    await this.boardAccess.ensureMember(memberId, boardId);

    board.transferOwnershipTo(memberId);
    await this.boardRepo.save(board);
  }
}
