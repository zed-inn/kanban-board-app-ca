import type { BaseEvent } from "@app/events/base.event";

export interface EventDispatcher {
  emit(event: BaseEvent<any>): Promise<void>;
}
