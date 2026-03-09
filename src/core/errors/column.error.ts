import { ApplicationError } from "./application.error";

export class NoColumnError extends ApplicationError {
  readonly error = "not_found";
  readonly code = "NO_COLUMN";
  constructor() {
    super("The requested column does not exist.");
  }
}

export class ColumnNotInBoardError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "COLUMN_NOT_IN_BOARD";
  constructor() {
    super("The column does not belong to the specified board.");
  }
}

export class InvalidColumnPositionError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "INVALID_COLUMN_POSITION";
  constructor() {
    super("The specified column position is invalid or taken.");
  }
}
