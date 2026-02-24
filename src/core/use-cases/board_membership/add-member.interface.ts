import { BoardMembership } from "../../entities/board_membership";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class AddMember {
  constructor(private memberRepo: MemberRepository) {}

  execute = async (boardId: string, memberId: string, newMemberId: string) => {
    const member = new BoardMembership({ boardId, memberId });
    const isMember = await this.memberRepo.membershipExists(member);

    if (!isMember)
      throw new Error("Non-member of a board cannot add members in a board.");

    const newMember = new BoardMembership({ boardId, memberId: newMemberId });
    const isNotNewMember = await this.memberRepo.membershipExists(newMember);

    if (isNotNewMember)
      throw new Error("Members of a board cannot join as 'NEW' members again.");

    await this.memberRepo.save(newMember);
  };
}
