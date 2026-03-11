import type { BaseEvent } from "@app/events/base.event";
import type { EventDispatcher } from "@interfaces/events/event-dispatcher.interface";
import type { EventTargetFactory } from "@interfaces/events/event-target-factory.interface";

export class EventsOrchestrator {
  constructor(
    private eventDispatch: EventDispatcher,
    readonly createTarget: EventTargetFactory,
  ) {}

  createNewBasket() {
    return new EventBasket();
  }

  async drainBasket(basket: EventBasket) {
    for (const event of basket.eventsList) await this.eventDispatch.emit(event);
  }
}

export class EventBasket {
  private _basket: BaseEvent<any>[];

  constructor() {
    this._basket = [];
  }

  public get eventsList() {
    return this._basket;
  }

  push(event: BaseEvent<any>) {
    this._basket.push(event);
  }

  pushMany(events: BaseEvent<any>[]) {
    this._basket.push(...events);
  }
}
