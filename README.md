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

### Repository
- Board Repository
```ts
interface BoardRepository {
  getById(id: string): Promise<Board>;
  getByIdAfterEnsuringOwner(id: string, ownerId: string): Promise<Board>;
  getByIdAfterEnsuringMember(id: string, memberId: string): Promise<Board>;
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
```

- Member Repository
```ts
interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getAllMembersOfBoardById(boardId: string): Promise<User[]>;
  removeAllMembersOfBoard(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
```

- Column Repository
```ts
ColumnRepository {
  getById(id: string): Promise<Column>;
  getByIdAfterEnsuringInBoard(id: string, boardId: string): Promise<Column>;
  getByPositionInBoard(
    position: number,
    boardId: string,
  ): Promise<Column | null>;
  getNextEmptyPositionInBoard(
    boardId: string,
    positionStep: number,
  ): Promise<number>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
```

- Card Repository
```ts
CardRepository {
  getById(id: string): Promise<Card>;
  getByIdAfterEnsuringInColumn(id: string, columnId: string): Promise<Card>;
  getByPositionInColumn(
    position: number,
    columnId: string,
  ): Promise<Card | null>;
  getNextEmptyPositionInColumn(
    columnId: string,
    positionStep: number,
  ): Promise<number>;
  remove(card: Card): Promise<void>;
  save(card: Card): Promise<void>;
}
```

### Policy
- Member Policy
```ts
interface MemberPolicy {
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
}
```

### Utils
- Unit Of Work
```ts
interface UnitOfWork {
  withTransaction<T>(work: () => Promise<T>): Promise<T>;
}
```

- Id Generator
```ts
export interface IdGenerator {
  generateUnique(): Promise<string>;
}
```

### Emitter
- Board Action Emitter
```ts
interface BoardActionEmitter {
  emitOwnerChange(users: User[], board: Board): Promise<void>;
  emitOwnershipTransferredToNewOwnerById(
    userId: string,
    board: Board,
  ): Promise<void>;
  emitBoardDeleted(users: User[], board: Board): Promise<void>;
  emitBoardRenamed(users: User[], board: Board): Promise<void>;
  emitNewMemberJoined(users: User[], board: Board): Promise<void>;
  emitMembershipCreatedToNewMemberById(
    userId: string,
    board: Board,
  ): Promise<void>;
  emitMemberLeft(users: User[], board: Board): Promise<void>;
}
```

- Column Action Emitter
```ts
interface ColumnActionEmitter {
  emitColumnAdded(users: User[], column: Column): Promise<void>;
  emitColumnRemoved(users: User[], column: Column): Promise<void>;
  emitColumnRenamed(users: User[], column: Column): Promise<void>;
  emitColumnReordered(users: User[], column: Column): Promise<void>;
}
```

- Card Action Emitter
```ts
interface CardActionEmitter {
  emitCardAdded(users: User[], card: Card): Promise<void>;
  emitCardRemoved(users: User[], card: Card): Promise<void>;
  emitCardBodyUpdated(users: User[], card: Card): Promise<void>;
  emitCardReordered(users: User[], card: Card): Promise<void>;
}
```

## How to use ?

The module gives and `Application` class which can be imported.

The `Application` requires all the ports to be supplied to it. No default ports are available.
Each interface/port must be implemented and supplied otherwise the application will not work correctly. \

The `Application` provides each use case to be used independently, for ex.
```ts

const app = new Application(idgen, memberRepo, ...);
app.renameBoard.execute(...arguments for renaming board required.);

```

