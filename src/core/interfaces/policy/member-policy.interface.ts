export interface MemberPolicy {
  ensureMember(memberId: string, boardId: string): Promise<void>;
  ensureNonMember(userId: string, boardId: string): Promise<void>;
  ensureOwner(memberId: string, boardId: string): Promise<void>;
}
