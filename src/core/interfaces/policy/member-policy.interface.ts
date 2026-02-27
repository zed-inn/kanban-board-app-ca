export interface MemberPolicy {
  ensureOwner(boardId: string, ownerId: string): Promise<void>;
  ensureMember(memberId: string, boardId: string): Promise<void>;
}
