import type { BoardId } from "@domain/value-objects/board-id.vo";
import type { UserId } from "@domain/value-objects/user-id.vo";

export type EventTarget =
  | { type: "user"; id: UserId }
  | { type: "room"; name: string; exclude?: UserId[] };

export interface EventTargetFactory {
  viaBoardIdExcluding(boardId: BoardId, userIds: UserId[]): EventTarget;
  viaBoardId(boardId: BoardId): EventTarget;
  viaUserId(userId: UserId): EventTarget;
}
