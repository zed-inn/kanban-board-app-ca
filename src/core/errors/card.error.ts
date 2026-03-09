import { ApplicationError } from "./application.error";

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

export class ParamsInsufficientCardBodyUpdateError extends ApplicationError {
  readonly error = "bad_request";
  readonly code = "PARAMS_INSUFFICIENT_CARD_BODY_UPDATE";
  constructor() {
    super("Must provide at least a title or content to update.");
  }
}

export class ParamsInsufficientCardReorderError extends ApplicationError {
  readonly error = "bad_request";
  readonly code = "PARAMS_INSUFFICIENT_CARD_REORDER";
  constructor() {
    super("Must provide a target columnId or ipoCardId to reorder.");
  }
}
