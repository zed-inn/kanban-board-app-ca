import { ApplicationError } from "./application.error";

export class NoBoardError extends ApplicationError {
  readonly error = "not_found";
  readonly code = "NO_BOARD";
  constructor() {
    super("The requested board does not exist.");
  }
}

export class NotBoardOwnerError extends ApplicationError {
  readonly error = "forbidden";
  readonly code = "NOT_BOARD_OWNER";
  constructor() {
    super("You are not the owner of this board.");
  }
}

export class NotBoardMemberError extends ApplicationError {
  readonly error = "forbidden";
  readonly code = "NOT_BOARD_MEMBER";
  constructor() {
    super("You are not a member of this board.");
  }
}

export class IsBoardMemberError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "IS_BOARD_MEMBER";
  constructor() {
    super("User is already a member of this board.");
  }
}

export class IsBoardOwnerError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "IS_BOARD_OWNER";
  constructor() {
    super("Cannot perform this action on the board owner.");
  }
}
