import { BoardMembership } from "../../entities/board_membership";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class RemoveMember {
  constructor(private memberRepo: MemberRepository) {}

  execute = async (boardId: string, memberId: string) => {
    const member = new BoardMembership({ boardId, memberId });
    const isMember = await this.memberRepo.membershipExists(member);

    if (!isMember)
      throw new Error("Non-member cannot act as members of a board and leave.");

    await this.memberRepo.remove(member);
  };
}
