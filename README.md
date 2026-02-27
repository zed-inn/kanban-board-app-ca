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
- Member Repository
- Column Repository
- Card Repository

### Policy
- Member Policy
- Column Policy
- Card Policy

### Utils
- Unit Of Work
- Id Generator

### Emitter
- Board Action Emitter
- Column Action Emitter
- Card Action Emitter

## How to use ?

The module gives and `Application` class which can be imported.

The `Application` requires all the ports to be supplied to it. No default ports are available.
Each interface/port must be implemented and supplied otherwise the application will not work correctly. \

The `Application` provides each use case to be used independently, for ex.
```ts

const app = new Application(idgen, memberRepo, ...);
app.renameBoard.execute(...arguments for renaming board required.);

```

