import { Board, BoardName } from "@domain/entities/board";
import { BoardMembership } from "@domain/entities/board-membership";
import { UserId } from "@domain/value-objects/user-id.vo";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { IdGenerator } from "@interfaces/utils/id-generator.interface";
import type { UnitOfWork } from "@interfaces/utils/unit-of-work.interface";

type CreateBoardCommand = {
  name: string;
  userId: string;
};

export class CreateBoard {
  constructor(
    private uow: UnitOfWork,
    private idGen: IdGenerator,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  private serialize(cmd: CreateBoardCommand) {
    return { name: new BoardName(cmd.name), userId: new UserId(cmd.userId) };
  }

  async execute(cmd: CreateBoardCommand) {
    const { name, userId } = this.serialize(cmd);

    const boardId = await this.idGen.generate();
    const board = new Board({ id: boardId, name: name.v, ownerId: userId.v });
    const membership = new BoardMembership({ boardId, memberId: userId.v });

    await this.uow.atomic(async (ctx) => {
      await this.boardRepo.save(board, ctx);
      await this.memberRepo.save(membership, ctx);
    });
  }
}
