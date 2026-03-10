export type KeysetPagination = {
  cursor?: unknown;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  nextCursor?: unknown;
};
