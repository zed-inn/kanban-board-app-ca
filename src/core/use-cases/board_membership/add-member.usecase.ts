import { BoardMembership } from "../../entities/board_membership";
import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class AddMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, memberId: string, userId: string) => {
    const board = await this.boardRepo.getByIdAfterEnsuringMember(
      boardId,
      memberId,
    );
    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);

    const member = new BoardMembership({ boardId: board.id, memberId: userId });
    const isMember = await this.memberRepo.exists(member);
    if (isMember)
      throw new Error("Requested user is already a member of the board.");

    await this.memberRepo.save(member);

    this.boardActionEmit.emitNewMemberJoined(members, board);
    this.boardActionEmit.emitMembershipCreatedToNewMemberById(userId, board);
  };
}
