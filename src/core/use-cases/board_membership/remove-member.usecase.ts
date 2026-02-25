import { BoardMembership } from "../../entities/board_membership";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class RemoveMember {
  constructor(private memberRepo: MemberRepository) {}

  execute = async (boardId: string, memberId: string) => {
    const member = new BoardMembership({ boardId, memberId });
    const isMember = await this.memberRepo.exists(member);

    if (!isMember)
      throw new Error("Board cannot be leaved without membership priviledges.");

    await this.memberRepo.remove(member);
  };
}
