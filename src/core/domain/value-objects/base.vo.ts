export abstract class VO<T> {
  protected abstract readonly value: T;

  public get v() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }
}
