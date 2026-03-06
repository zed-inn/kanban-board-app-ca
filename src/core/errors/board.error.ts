export class NoBoardError extends Error {
  override message: string = "NO_BOARD";
}

export class NotBoardOwnerError extends Error {
  override message: string = "NOT_BOARD_OWNER";
}

export class NotBoardMemberError extends Error {
  override message: string = "NOT_BOARD_MEMBER";
}

export class IsBoardMemberError extends Error {
  override message: string = "IS_BOARD_MEMBER";
}
