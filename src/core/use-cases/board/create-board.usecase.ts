import { Board } from "../../entities/board";
import { BoardMembership } from "../../entities/board_membership";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";
import type { UnitOfWork } from "../../interfaces/utils/unit-of-work.interface";
import type { IdGenerator } from "../../interfaces/utils/id-generator.interface";

export class CreateBoard {
  constructor(
    private uow: UnitOfWork,
    private idGen: IdGenerator,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
  ) {}

  execute = async (name: string, userId: string) => {
    const boardId = await this.idGen.generateUnique();

    await this.uow.atomic(async () => {
      const board = new Board({ id: boardId, name, ownerId: userId });
      await this.boardRepo.save(board);

      const member = new BoardMembership({ boardId, memberId: userId });
      await this.memberRepo.save(member);
    });
  };
}
