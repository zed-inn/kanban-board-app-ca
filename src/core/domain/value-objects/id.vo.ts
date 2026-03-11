import { VO } from "./base.vo";

export abstract class Id<T extends string> extends VO<string> {
  protected readonly __type!: T;
  protected readonly value: string;

  constructor(id: string) {
    super();
    this.value = id.trim();
  }

  isSame(id: string): boolean;
  isSame(id: Id<any>): boolean;

  isSame(prm: string | Id<any>) {
    return this.value === prm || this.value === prm.toString();
  }

  isDifferent(id: string): boolean;
  isDifferent(id: Id<any>): boolean;

  isDifferent(prm: string | Id<any>) {
    return this.value !== prm && this.value !== prm.toString();
  }
}
