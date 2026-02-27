import { NotBoardOwnerError } from "../../errors/board.error";
import type { BoardActionEmitter } from "../../interfaces/emitter/board-action-emitter.interface";
import type { MemberPolicy } from "../../interfaces/policy/member-policy.interface";
import type { BoardRepository } from "../../interfaces/repo/board-repository.interface";
import type { MemberRepository } from "../../interfaces/repo/member-repository.interface";

export class ChangeOwner {
  constructor(
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private memberPolicy: MemberPolicy,
    private boardActionEmit: BoardActionEmitter,
  ) {}

  execute = async (boardId: string, ownerId: string, userId: string) => {
    const board = await this.boardRepo.getById(boardId);
    if (board.attrbs.ownerId !== ownerId) throw new NotBoardOwnerError();

    await this.memberPolicy.ensureMember(userId, board.id);
    board.transferOwnershipTo(userId);

    await this.boardRepo.save(board);

    const members = await this.memberRepo.getAllMembersOfBoardById(boardId);
    this.boardActionEmit.emitOwnerChange(members, board);
    this.boardActionEmit.emitOwnershipTransferredToNewOwnerById(userId, board);
  };
}
