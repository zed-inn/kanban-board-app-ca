import { BoardMembership } from "../../entities/board_membership";
import type { MemberRepository } from "../../interfaces/member-repository.interface";

export class AddMember {
  constructor(private memberRepo: MemberRepository) {}

  execute = async (boardId: string, memberId: string, newMemberId: string) => {
    const member = new BoardMembership({ boardId, memberId });
    const isMember = await this.memberRepo.exists(member);

    if (!isMember)
      throw new Error("Non-member of a board cannot add members to a board.");

    const newMember = new BoardMembership({ boardId, memberId: newMemberId });
    const isNotNewMember = await this.memberRepo.exists(newMember);
    const isNewMember = !isNotNewMember;

    if (isNewMember) await this.memberRepo.save(newMember);
  };
}
