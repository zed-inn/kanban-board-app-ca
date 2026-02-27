import { BoardMembership } from "../../entities/board_membership";
import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, memberId: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      memberId,
    );

    const member = new BoardMembership({ boardId: board.id, memberId });
    await this.memberRepo.remove(member);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.boardActionEmit.emitMemberLeft(members, board);
  };
}
