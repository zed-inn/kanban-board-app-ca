# Kanban Board Application

## Entities :

- User
  - Contains private `_id`
  - Has no methods

- Board
  - Contains private `_id`, `name`, `ownerId`
  - Has methods `rename`, `transferOwnershipTo`

- Board Membership
  - Contains private `boardId`, `memberId`
  - Has no methods

- Column
  - Contains private `_id`, `name`, `position`, `boardId`
  - Has methods `rename`, `moveTo`

- Card
  - Contains private `_id`, `title`, `content`, `position`, `columnId`
  - Has methods `updateBody`, `moveTo`, `relocateToNewColumn`

## Use cases

### Board

- Create Board
- Delete Board
- Change Owner
- Rename Board

### Board Membership

- Add Member
- Remove Member

### Column

- Add Column
- Remove Column
- Rename Column
- Reorder Column

### Card

- Add Card
- Remove Card
- Update Card Body
- Reorder Card

## Interfaces / Ports

### Constants

- Column Constant

```ts
export interface ColumnConstants {
  POSITION_GAP: number;
}
```

- Card Constant

```ts
export interface CardConstant {
  POSITION_GAP: number;
}
```

### Repository

- Board Repository

```ts
interface BoardRepository {
  getByOwnerId(userId: string): Promise<Board[]>;
  getByIds(ids: string[]): Promise<Board[]>;
  getById(id: string): Promise<Board>;
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
```

- Member Repository

```ts
interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getByUserId(userId: string): Promise<BoardMembership[]>;
  getAllBoardMemberIdsById(boardId: string): Promise<string[]>;
  removeAllBoardMembers(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
```

- Column Repository

```ts
interface ColumnRepository {
  getByBoardId(boardId: string): Promise<Column[]>;
  getById(id: string): Promise<Column>;
  getTopInBoard(boardId: string): Promise<Column | null>;
  getTopColumnBelowPositionInBoard(
    position: number,
    boardId: string,
  ): Promise<Column | null>;
  getBottomColumnAbovePositionInBoard(
    position: number,
    boardId: string,
  ): Promise<Column | null>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
```

- Card Repository

```ts
interface CardRepository {
  getByColumnId(columnId: string): Promise<Card[]>;
  getById(id: string): Promise<Card>;
  getTopInColumn(columnId: string): Promise<Card | null>;
  getTopCardBelowPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<Card | null>;
  getBottomCardAbovePositionInColumn(
    position: number,
    columnId: string,
  ): Promise<Card | null>;
  remove(card: Card): Promise<void>;
  save(card: Card): Promise<void>;
}
```

### Policy

- Member Policy

```ts
interface MemberPolicy {
  ensureOwner(boardId: string, ownerId: string): Promise<void>;
  ensureMember(memberId: string, boardId: string): Promise<void>;
}
```

- Column Policy

```ts
interface ColumnPolicy {
  ensureColumnInBoard(columnId: string, boardId: string): Promise<void>;
  ensureEmptyPositionInBoard(position: number, boardId: string): Promise<void>;
}
```

- Card Policy

```ts
interface CardPolicy {
  ensureEmptyPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<void>;
  ensureCardInColumn(id: string, columnId: string): Promise<void>;
}
```

### Utils

- Unit Of Work

```ts
interface UnitOfWork {
  atomic<T>(work: () => Promise<T>): Promise<T>;
}
```

- Id Generator

```ts
export interface IdGenerator {
  generateUnique(): Promise<string>;
}
```

### Emitter

There is only one emitter that depends on `Event` object defined in the same file.
Most of the events are supposed to be Fire-and-forget thing.
Events emitted by Use cases are defined in the usecases themselves in the function definitions.
(Function definition are undergoing...)

## How to use ?

The module exports all the interface and usecases class which can be imported in the infra.

Each interface can be implemented in desired way. \
For each use case, a new instance of that use case and new instances of all the interface required in necessary for desired results. \

for ex.

```ts
const idGenerator = new UUIDGenerator();
const memberRepo = new PostgresBoardMemberRepository(db, {});
const cardRepo = new PostgresCardRepository(db, {});
const memberPolicy = new PostgresBoardMemberPolicy(db);
const columnPolicy = new PostgresColumnPolicy(db);
const eventEmitter = new IoEventEmitter(io);

const addCard = new AddCard(
  idGenerator,
  cardRepo,
  memberRepo,
  cardRepo,
  memberPolicy,
  columnPolicy,
  eventEmitter,
);
await addCard.execute(b.title, b.content, p.columnId, p.boardId, user.id);
```
