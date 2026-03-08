export class NoCardError extends Error {
  override message: string = "NO_CARD";
}

export class CardNotInColumnError extends Error {
  override message: string = "CARD_NOT_IN_COLUMN";
}

export class InvalidCardPositionError extends Error {
  override message: string = "INVALID_CARD_POSITION";
}

export class ParamsInsufficientCardBodyUpdateError extends Error {
  override message: string = "PARAMS_INSUFFICIENT_CARD_BODY_UPDATE";
}

export class ParamsInsufficientCardReorderError extends Error {
  override message: string = "PARAMS_INSUFFICIENT_CARD_REORDER";
}
