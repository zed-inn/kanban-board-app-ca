import type { Column } from "../../entities/column";
import type { User } from "../../entities/user";

export interface ColumnActionEmitter {
  emitColumnAdded(users: User[], column: Column): Promise<void>;
  emitColumnRemoved(users: User[], column: Column): Promise<void>;
  emitColumnRenamed(users: User[], column: Column): Promise<void>;
  emitColumnReordered(users: User[], column: Column): Promise<void>;
}
