export class NoColumnError extends Error {
  override message: string = "NO_COLUMN";
}

export class ColumnNotInBoardError extends Error {
  override message: string = "COLUMN_NOT_IN_BOARD";
}

export class InvalidColumnPositionError extends Error {
  override message: string = "INVALID_COLUMN_POSITION";
}
