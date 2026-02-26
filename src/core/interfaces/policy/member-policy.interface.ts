export interface MemberPolicy {
  ensureMember(memberId: string, boardId: string): Promise<void>;
}
