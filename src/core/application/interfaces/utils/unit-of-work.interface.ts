export interface UnitOfWork {
  atomic<T>(work: (ctx?: unknown) => Promise<T>): Promise<T>;
}
