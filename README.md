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
  save(board: Board): Promise<void>;
  remove(board: Board): Promise<void>;
}
```

- Member Repository
```ts
interface MemberRepository {
  exists(membership: BoardMembership): Promise<boolean>;
  getAllBoardMemberIdsById(boardId: string): Promise<string[]>;
  removeAllBoardMembers(board: Board): Promise<void>;
  remove(membership: BoardMembership): Promise<void>;
  save(membership: BoardMembership): Promise<void>;
}
```

- Column Repository
```ts
interface ColumnRepository {
  getById(id: string): Promise<Column>;
  getTopInBoard(boardId: string): Promise<Column | null>;
  remove(column: Column): Promise<void>;
  save(column: Column): Promise<void>;
}
```

- Card Repository
```ts
interface CardRepository {
  getById(id: string): Promise<Card>;
  getTopInColumn(columnId: string): Promise<Card | null>;
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
There is only one emitter that depends on `Event` object defined in the same file. 
Most of the events are supposed to be Fire-and-forget thing. 
Events emitted by Use cases are defined in the usecases themselves in the function definitions.
(Function definition are undergoing...)

## How to use ?

The module gives and `Application` class which can be imported.

The `Application` requires all the ports to be supplied to it. No default ports are available.
Each interface/port must be implemented and supplied otherwise the application will not work correctly. \

The `Application` provides each use case to be used independently, for ex.
```ts

const app = new Application(idgen, memberRepo, ...);
app.renameBoard.execute(...arguments for renaming board required.);

```

