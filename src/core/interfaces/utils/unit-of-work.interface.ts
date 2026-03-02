import type { CardPolicy } from "../policy/card-policy.interface";
import type { ColumnPolicy } from "../policy/column-policy.interface";
import type { MemberPolicy } from "../policy/member-policy.interface";
import type { BoardRepository } from "../repo/board-repository.interface";
import type { CardRepository } from "../repo/card-repository.interface";
import type { ColumnRepository } from "../repo/column-repository.interface";
import type { MemberRepository } from "../repo/member-repository.interface";
import type { UserRepository } from "../repo/user-repository.interface";

export interface RepositoryProvider {
  userRepo: UserRepository;
  memberRepo: MemberRepository;
  boardRepo: BoardRepository;
  columnRepo: ColumnRepository;
  cardRepo: CardRepository;
}

export interface PolicyProvider {
  memberPolicy: MemberPolicy;
  columnPolicy: ColumnPolicy;
  cardPolicy: CardPolicy;
}

export interface UnitOfWork {
  withTransaction<T>(
    work: (repos: RepositoryProvider, policies: PolicyProvider) => Promise<T>,
  ): Promise<T>;
}
