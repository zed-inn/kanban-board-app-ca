import type { EventTarget } from "@interfaces/events/event-target-factory.interface";

export abstract class BaseEvent<T extends unknown> {
  protected abstract readonly _name: string;
  protected readonly _target: EventTarget | EventTarget[];
  protected readonly _data: T;

  constructor(params: { target: EventTarget | EventTarget[]; data: T }) {
    this._data = params.data;
    this._target = params.target;
  }

  public get name() {
    return this._name;
  }
  public get target() {
    return this._target;
  }
  public get data() {
    return this._data;
  }

  toJSON() {
    return { name: this._name, target: this._target, data: this._data };
  }

  valueOf() {
    return this.toJSON();
  }
}
