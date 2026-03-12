# Kanban Core: Pure Domain Engine

This package contains the strictly bounded, framework-agnostic application core of the Kanban system. It is a pure state machine.

There are no database drivers here. There are no HTTP frameworks. There is no `pg`, no `fastify`, and no ORM. This layer dictates the business logic, defines the contracts, and forces the infrastructure layer to do the dirty work.

## Folder Structure

```
src/
├── core/
│   ├── domain/               # Enterprise Business Rules (Entities, Value Objects)
│   │   ├── entities/         # Board, Column, Card, BoardMembership
│   │   ├── errors/           # Pure domain exceptions
│   │   ├── services/         # Pure algorithmic services (LexoRank)
│   │   └── value-objects/    # Strict validation wrappers (CardTitle, ColumnId)
│   └── application/          # Application Business Rules (Use Cases)
│       ├── errors/           # Use-case specific errors (NotBoardOwnerError)
│       ├── events/           # Domain event definitions
│       ├── interfaces/       # Contracts for the Infrastructure to implement
│       │   ├── events/       # EventDispatcher, EventTargetFactory
│       │   ├── queries/      # CQRS Read Models (BoardQuery, CardQuery)
│       │   ├── repo/         # Write Models (BoardRepository, CardRepository)
│       │   └── utils/        # UnitOfWork, IdGenerator
│       ├── services/         # Orchestration (BoardAccessService, EventOrchestrator)
│       └── use-cases/        # 18 isolated, single-responsibility action classes
└── index.ts                  # The Composition Root exporting the `Kanban` Facade
```

## Architectural Highlights

### 1. Violent Decoupling (Clean Architecture)

The domain dictates the requirements. The infrastructure merely fulfills them.

**Repositories** only accept and return pure Domain Entities for state mutations.

**Queries (CQRS)** bypass entities entirely, defining strict read-only contracts (`CardReadModel`) to guarantee type safety without polluting the domain with database metadata.

**The Facade Pattern**: The entire domain is encapsulated in a single `Kanban` class. The infrastructure instantiates this class once and calls its Use Cases.

### 2. _O(1)_ Distributed Sorting (LexoRank)

Standard drag-and-drop systems use integer arrays, meaning moving a card from position `0` to `1` requires updating the index of every other card in the database ($O(N)$).
To prevent cascading database locks, this engine implements **LexoRank** (string-based lexicographical sorting). Reordering a card simply calculates the midpoint string between two existing cards. Database writes are permanently _O(1)_.

### 3. Framework-Agnostic Atomicity (Opaque Token UoW)

Race conditions corrupt data. To wrap multi-repository operations (like creating a board and assigning the owner) in ACID transactions without leaking SQL into the domain, this system uses an **Opaque Token Unit of Work**. The core passes a `ctx?: unknown` token through the Use Cases. It doesn't know what it is; it just blindly carries the Postgres connection pool from the UoW to the Repositories.

### 4. Phantom-Free Event Orchestration

Emitting real-time WebSocket events before a database transaction commits leads to phantom state (clients see data that rolled back).
We use an **Event Basket**. Domain events are pushed to an in-memory queue during the Use Case execution. The orchestrator only drains the basket and dispatches to the infrastructure after the Use Case successfully terminates.

## Current Limitations & Tradeoffs

**LexoRank String Degradation**: Because LexoRank constantly halves the distance between strings, heavily reordered lists will result in increasingly long string values. There is currently no `RebalanceRankJob` implemented to reset the strings to standard intervals when they get too long.

**The Value Object Tax**: Aggressive defensive programming (instantiating `CardTitle`, `CardPosition`, etc., for every mutation) ensures pristine data but creates high garbage collection overhead for bulk inserts.

**No "Join Room" Use Case**: The event target factory handles routing, but the core currently lacks a dedicated use case to handle explicit real-time presence/room synchronization.
