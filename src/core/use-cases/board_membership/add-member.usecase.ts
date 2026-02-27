import { BoardMembership } from "../../entities/board_membership";
import { IsBoardMemberError } from "../../errors/board.error";
import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class AddMember {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, memberId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    await this.memberPolicy.ensureMember(memberId, board.id);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);

    const member = new BoardMembership({ boardId: board.id, memberId: userId });
    if (await this.memberRepo.exists(member)) throw new IsBoardMemberError();

    await this.memberRepo.save(member);

    this.boardActionEmit.emitNewMemberJoined(members, board);
    this.boardActionEmit.emitMembershipCreatedToNewMemberById(userId, board);
  };
}
