import { Board } from "../entities/board";
import { BoardMembership } from "../entities/board_membership";
import type { BoardRepository } from "../interfaces/board-repository";
import type { MemberRepository } from "../interfaces/member-repository";
import type { UnitOfWork } from "../interfaces/unit-of-work";

export class CreateBoard {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private uow: UnitOfWork,
  ) {}

  execute = async (boardId: string, name: string, userId: string) => {
    return await this.uow.withTransaction(async () => {
      const board = new Board({ id: boardId, name, ownerId: userId });
      await this.boardRepo.save(board);

      const member = new BoardMembership({ boardId, memberId: userId });
      await this.memberRepo.save(member);
    });
  };
}
