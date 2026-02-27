import type { Card } from "../../entities/card";
import type { User } from "../../entities/user";

export interface CardActionEmitter {
  emitCardAdded(users: User[], card: Card): Promise<void>;
  emitCardRemoved(users: User[], card: Card): Promise<void>;
  emitCardBodyUpdated(users: User[], card: Card): Promise<void>;
  emitCardReordered(users: User[], card: Card): Promise<void>;
}
