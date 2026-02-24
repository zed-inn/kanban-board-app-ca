import { Board } from "../../entities/board";
import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/board-repository.interface";
import type { MemberRepository } from "../../interfaces/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/unit-of-work.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class CreateBoard {
  constructor(
    private idGen: IdGenerator,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private uow: UnitOfWork,
  ) {}

  execute = async (name: string, userId: string) => {
    const boardId = this.idGen.generate();

    await this.uow.withTransaction(async () => {
      const board = new Board({ id: boardId, name, ownerId: userId });
      await this.boardRepo.save(board);

      const member = new BoardMembership({ boardId, memberId: userId });
      await this.memberRepo.save(member);
    });
  };
}
