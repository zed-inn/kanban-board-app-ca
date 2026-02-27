import type { BoardActionEmitter } from "./core/interfaces/emitter/board-action-emitter.interface";
import type { CardActionEmitter } from "./core/interfaces/emitter/card-action-emitter.interface";
import type { ColumnActionEmitter } from "./core/interfaces/emitter/column-action-emitter.interface";
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
    private boardActionEmitter: BoardActionEmitter,
    private columnActionEmitter: ColumnActionEmitter,
    private cardActionEmitter: CardActionEmitter,
  ) {
    this.changeOwnerOfBoard = new ChangeOwner(
      boardRepo,
      memberRepo,
      memberPolicy,
      boardActionEmitter,
    );
    this.createBoard = new CreateBoard(uow, idGen, boardRepo, memberRepo);
    this.deleteBoard = new DeleteBoard(
      uow,
      boardRepo,
      memberRepo,
      boardActionEmitter,
    );
    this.renameBoard = new RenameBoard(
      boardRepo,
      memberRepo,
      boardActionEmitter,
    );

    this.addMember = new AddMember(boardRepo, memberRepo, boardActionEmitter);
    this.removeMember = new RemoveMember(
      boardRepo,
      memberRepo,
      boardActionEmitter,
    );

    this.addColumn = new AddColumn(
      idGen,
      memberRepo,
      columnRepo,
      memberPolicy,
      columnActionEmitter,
    );
    this.removeColumn = new RemoveColumn(
      memberRepo,
      columnRepo,
      memberPolicy,
      columnActionEmitter,
    );
    this.reorderColumn = new ReorderColumn(
      memberRepo,
      columnRepo,
      memberPolicy,
      columnPolicy,
      columnActionEmitter,
    );
    this.renameColumn = new RenameColumn(
      memberRepo,
      columnRepo,
      memberPolicy,
      columnActionEmitter,
    );

    this.addCard = new AddCard(
      idGen,
      memberRepo,
      cardRepo,
      memberPolicy,
      columnPolicy,
      cardActionEmitter,
    );
    this.removeCard = new RemoveCard(
      memberRepo,
      cardRepo,
      memberPolicy,
      columnPolicy,
      cardActionEmitter,
    );
    this.reorderCard = new ReorderCard(
      memberRepo,
      cardRepo,
      memberPolicy,
      columnPolicy,
      cardPolicy,
      cardActionEmitter,
    );
    this.updateCardBody = new UpdateCardBody(
      memberRepo,
      cardRepo,
      memberPolicy,
      columnPolicy,
      cardActionEmitter,
    );
  }
}
