export interface UnitOfWork {
  atomic<T>(work: () => Promise<T>): Promise<T>;
}
