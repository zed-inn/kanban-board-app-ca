export type KeysetPagination = {
  cursor?: string;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  nextCursor?: string;
};
