import type { CardPolicy } from "./core/interfaces/policy/card-policy.interface";
import type { ColumnPolicy } from "./core/interfaces/policy/column-policy.interface";
import type { MemberPolicy } from "./core/interfaces/policy/member-policy.interface";
import type { BoardRepository } from "./core/interfaces/repo/board-repository.interface";
import type { CardRepository } from "./core/interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "./core/interfaces/repo/column-repository.interface";
import type { MemberRepository } from "./core/interfaces/repo/member-repository.interface";
import type { IdGenerator } from "./core/interfaces/utils/id-generator.interface";
import type { UnitOfWork } from "./core/interfaces/utils/unit-of-work.interface";
import { ChangeOwner } from "./core/use-cases/board/change-owner.usecase";
import { CreateBoard } from "./core/use-cases/board/create-board.usecase";
import { DeleteBoard } from "./core/use-cases/board/delete-board.usecase";
import { RenameBoard } from "./core/use-cases/board/rename-board.usecase";
import { AddMember } from "./core/use-cases/board_membership/add-member.usecase";
import { RemoveMember } from "./core/use-cases/board_membership/remove-member.usecase";
import { AddCard } from "./core/use-cases/card/add-card.usecase";
import { RemoveCard } from "./core/use-cases/card/remove-card.usecase";
import { ReorderCard } from "./core/use-cases/card/reorder-card.usecase";
import { UpdateCardBody } from "./core/use-cases/card/update-card-body.usecase";
import { AddColumn } from "./core/use-cases/column/add-column.usecase";
import { RemoveColumn } from "./core/use-cases/column/remove-column.usecase";
import { RenameColumn } from "./core/use-cases/column/rename-column.usecase";
import { ReorderColumn } from "./core/use-cases/column/reorder-column.usecase";

export class Application {
  public readonly changeOwnerOfBoard: ChangeOwner;
  public readonly createBoard: CreateBoard;
  public readonly deleteBoard: DeleteBoard;
  public readonly renameBoard: RenameBoard;

  public readonly addMember: AddMember;
  public readonly removeMember: RemoveMember;

  public readonly addCard: AddCard;
  public readonly removeCard: RemoveCard;
  public readonly reorderCard: ReorderCard;
  public readonly updateCardBody: UpdateCardBody;

  public readonly addColumn: AddColumn;
  public readonly removeColumn: RemoveColumn;
  public readonly reorderColumn: ReorderColumn;
  public readonly renameColumn: RenameColumn;

  constructor(
    private idGen: IdGenerator,
    private uow: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private cardRepo: CardRepository,
    private memberPolicy: MemberPolicy,
    private columnPolicy: ColumnPolicy,
    private cardPolicy: CardPolicy,
  ) {
    this.changeOwnerOfBoard = new ChangeOwner(boardRepo, memberPolicy);
    this.createBoard = new CreateBoard(uow, idGen, boardRepo, memberRepo);
    this.deleteBoard = new DeleteBoard(uow, boardRepo, memberRepo);
    this.renameBoard = new RenameBoard(boardRepo);

    this.addMember = new AddMember(boardRepo, memberRepo);
    this.removeMember = new RemoveMember(boardRepo, memberRepo);

    this.addCard = new AddCard(idGen, cardRepo, memberPolicy, columnPolicy);
    this.removeCard = new RemoveCard(cardRepo, memberPolicy, columnPolicy);
    this.reorderCard = new ReorderCard(
      cardRepo,
      memberPolicy,
      columnPolicy,
      cardPolicy,
    );
    this.updateCardBody = new UpdateCardBody(
      cardRepo,
      memberPolicy,
      columnPolicy,
    );

    this.addColumn = new AddColumn(idGen, columnRepo, memberPolicy);
    this.removeColumn = new RemoveColumn(memberPolicy, columnRepo);
    this.reorderColumn = new ReorderColumn(
      memberPolicy,
      columnRepo,
      columnPolicy,
    );
    this.renameColumn = new RenameColumn(memberPolicy, columnRepo);
  }
}
