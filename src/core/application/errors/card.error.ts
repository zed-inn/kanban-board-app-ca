import { ApplicationError } from "../../domain/errors/application.error";

export class NoCardError extends ApplicationError {
  readonly error = "not_found";
  readonly code = "NO_CARD";
  constructor() {
    super("The requested card does not exist.");
  }
}

export class CardNotInColumnError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "CARD_NOT_IN_COLUMN";
  constructor() {
    super("The card does not belong to the specified column.");
  }
}

export class InvalidCardPositionError extends ApplicationError {
  readonly error = "conflict";
  readonly code = "INVALID_CARD_POSITION";
  constructor() {
    super("The specified card position is invalid or taken.");
  }
}
