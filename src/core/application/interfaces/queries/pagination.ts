export type KeysetPagination<T extends unknown = unknown> = {
  cursor?: T;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  nextCursor?: unknown;
};
