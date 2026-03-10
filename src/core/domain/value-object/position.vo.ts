import { VO } from "./base.vo";

export abstract class Position<T extends string> extends VO<string> {
  protected readonly __type!: T;
  protected readonly value: string;

  constructor(position: string) {
    super();
    this.value = position.trim();
  }

  isAfter(position: Position<any>) {
    return this.value > position.value;
  }

  isBefore(position: Position<any>) {
    return this.value < position.value;
  }

  isEqual(position: Position<any>) {
    return this.value === position.value;
  }
}
