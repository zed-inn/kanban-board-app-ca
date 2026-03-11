export { ApplicationError } from "@errors/application.error";
export {
  IsBoardMemberError,
  IsBoardOwnerError,
  NoBoardError,
  NotBoardMemberError,
  NotBoardOwnerError,
} from "@errors/board.error";
export {
  CardNotInColumnError,
  InvalidCardPositionError,
  NoCardError,
} from "@errors/card.error";
export {
  ColumnNotInBoardError,
  InvalidColumnPositionError,
  NoColumnError,
} from "@errors/column.error";

export type { EventTargetFactory } from "@interfaces/events/event-target-factory.interface";
export type { EventDispatcher } from "@interfaces/events/event-dispatcher.interface";
export type { BoardQuery } from "@interfaces/queries/board-query.interface";
export type { CardQuery } from "@interfaces/queries/card-query.interface";
export type { ColumnQuery } from "@interfaces/queries/column-query.interface";
export type { BoardRepository } from "@interfaces/repo/board-repository.interface";
export type { CardRepository } from "@interfaces/repo/card-repository.interface";
export type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
export type { MemberRepository } from "@interfaces/repo/member-repository.interface";
export type { IdGenerator } from "@interfaces/utils/id-generator.interface";
export type { UnitOfWork } from "@interfaces/utils/unit-of-work.interface";

import type { EventDispatcher } from "@interfaces/events/event-dispatcher.interface";
import type { EventTargetFactory } from "@interfaces/events/event-target-factory.interface";
import type { BoardQuery } from "@interfaces/queries/board-query.interface";
import type { CardQuery } from "@interfaces/queries/card-query.interface";
import type { ColumnQuery } from "@interfaces/queries/column-query.interface";
import type { BoardRepository } from "@interfaces/repo/board-repository.interface";
import type { CardRepository } from "@interfaces/repo/card-repository.interface";
import type { ColumnRepository } from "@interfaces/repo/column-repository.interface";
import type { MemberRepository } from "@interfaces/repo/member-repository.interface";
import type { IdGenerator } from "@interfaces/utils/id-generator.interface";
import type { UnitOfWork } from "@interfaces/utils/unit-of-work.interface";
import { BoardAccessService } from "@services/board-access.service";
import { CardOrderingService } from "@services/card-ordering.service";
import { ColumnAccessService } from "@services/column-access.service";
import { ColumnOrderingService } from "@services/column-ordering.service";
import { EventsOrchestrator } from "@services/event-orchestrator.service";
import { AddMember } from "@usecases/board-membership/add-member.usecase";
import { RemoveMember } from "@usecases/board-membership/remove-member.usecase";
import { ChangeOwner } from "@usecases/board/change-owner.usecase";
import { CreateBoard } from "@usecases/board/create-board.usecase";
import { DeleteBoard } from "@usecases/board/delete-board.usecase";
import { GetMemberBoards } from "@usecases/board/get-member-boards.usecase";
import { GetOwnedBoards } from "@usecases/board/get-owned-boards.usecase";
import { RenameBoard } from "@usecases/board/rename-board.usecase";
import { AddCard } from "@usecases/card/add-card.usecase";
import { GetColumnCards } from "@usecases/card/get-column-cards.usecase";
import { RemoveCard } from "@usecases/card/remove-card.usecase";
import { ReorderCard } from "@usecases/card/reorder-card.usecase";
import { UpdateCardBody } from "@usecases/card/update-card-body.usecase";
import { AddColumn } from "@usecases/column/add-column.usecase";
import { GetBoardColumns } from "@usecases/column/get-board-columns.usecase";
import { RemoveColumn } from "@usecases/column/remove-column.usecase";
import { RenameColumn } from "@usecases/column/rename-column.usecase";
import { ReorderColumn } from "@usecases/column/reorder-column.usecase";

export class Kanban {
  public readonly changeOwnerOfBoard: ChangeOwner;
  public readonly createBoard: CreateBoard;
  public readonly deleteBoard: DeleteBoard;
  public readonly renameBoard: RenameBoard;
  public readonly getMemberBoards: GetMemberBoards;
  public readonly getOwnerBoards: GetOwnedBoards;

  public readonly addMember: AddMember;
  public readonly removeMember: RemoveMember;

  public readonly addCard: AddCard;
  public readonly removeCard: RemoveCard;
  public readonly reorderCard: ReorderCard;
  public readonly updateCardBody: UpdateCardBody;
  public readonly getColumnCards: GetColumnCards;

  public readonly addColumn: AddColumn;
  public readonly removeColumn: RemoveColumn;
  public readonly reorderColumn: ReorderColumn;
  public readonly renameColumn: RenameColumn;
  public readonly getBoardColumns: GetBoardColumns;

  private readonly boardAccessService: BoardAccessService;
  private readonly columnAccessService: ColumnAccessService;
  private readonly cardOrderingService: CardOrderingService;
  private readonly columnOrderingService: ColumnOrderingService;

  private readonly eventOrchestrator: EventsOrchestrator;

  constructor(
    private idGenerator: IdGenerator,
    private unitOfWork: UnitOfWork,
    private boardRepo: BoardRepository,
    private memberRepo: MemberRepository,
    private columnRepo: ColumnRepository,
    private cardRepo: CardRepository,
    private boardQuery: BoardQuery,
    private columnQuery: ColumnQuery,
    private cardQuery: CardQuery,
    private eventTargetFactory: EventTargetFactory,
    private eventDispatcher: EventDispatcher,
  ) {
    this.boardAccessService = new BoardAccessService(memberRepo);
    this.columnAccessService = new ColumnAccessService(columnRepo);
    this.cardOrderingService = new CardOrderingService(cardRepo);
    this.columnOrderingService = new ColumnOrderingService(columnRepo);
    this.eventOrchestrator = new EventsOrchestrator(
      eventDispatcher,
      eventTargetFactory,
    );

    this.changeOwnerOfBoard = new ChangeOwner(
      boardRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.createBoard = new CreateBoard(
      unitOfWork,
      idGenerator,
      boardRepo,
      memberRepo,
    );

    this.deleteBoard = new DeleteBoard(
      unitOfWork,
      boardRepo,
      memberRepo,
      this.eventOrchestrator,
    );

    this.getMemberBoards = new GetMemberBoards(boardQuery);

    this.getOwnerBoards = new GetOwnedBoards(boardQuery);

    this.renameBoard = new RenameBoard(
      boardRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.addMember = new AddMember(
      boardRepo,
      memberRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.removeMember = new RemoveMember(
      boardRepo,
      memberRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.addCard = new AddCard(
      idGenerator,
      cardRepo,
      this.boardAccessService,
      this.columnAccessService,
      this.cardOrderingService,
      this.eventOrchestrator,
    );

    this.getColumnCards = new GetColumnCards(
      cardQuery,
      this.columnAccessService,
      this.boardAccessService,
    );

    this.removeCard = new RemoveCard(
      cardRepo,
      this.boardAccessService,
      this.columnAccessService,
      this.eventOrchestrator,
    );

    this.reorderCard = new ReorderCard(
      cardRepo,
      this.boardAccessService,
      this.columnAccessService,
      this.cardOrderingService,
      this.eventOrchestrator,
    );

    this.updateCardBody = new UpdateCardBody(
      cardRepo,
      this.boardAccessService,
      this.columnAccessService,
      this.eventOrchestrator,
    );

    this.addColumn = new AddColumn(
      idGenerator,
      columnRepo,
      this.boardAccessService,
      this.columnOrderingService,
      this.eventOrchestrator,
    );

    this.getBoardColumns = new GetBoardColumns(
      columnQuery,
      this.boardAccessService,
    );

    this.removeColumn = new RemoveColumn(
      columnRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.renameColumn = new RenameColumn(
      columnRepo,
      this.boardAccessService,
      this.eventOrchestrator,
    );

    this.reorderColumn = new ReorderColumn(
      columnRepo,
      this.boardAccessService,
      this.columnOrderingService,
      this.eventOrchestrator,
    );
  }
}
