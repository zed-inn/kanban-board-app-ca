import { BoardId } from "@domain/value-object/board-id.vo";
import { UserId } from "@domain/value-object/user-id.vo";
import { NotBoardOwnerError } from "@errors/board.error";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "@interfaces/utils/unit-of-work.interface";

type DeleteBoardCommand = {
  boardId: string;
  userId: string;
};

export class DeleteBoard {
  constructor(
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  private serialize(cmd: DeleteBoardCommand) {
    return {
      boardId: new BoardId(cmd.boardId),
      userId: new UserId(cmd.userId),
    };
  }

  async execute(cmd: DeleteBoardCommand) {
    const { boardId, userId } = this.serialize(cmd);

    const board = await this.boardRepo.getById(boardId);
    if (board.ownerId.isDifferent(userId)) throw new NotBoardOwnerError();

    await this.uow.atomic(async (ctx) => {
      await this.boardRepo.remove(board, ctx);
      await this.memberRepo.removeAll(boardId, ctx);
    });
  }
}
