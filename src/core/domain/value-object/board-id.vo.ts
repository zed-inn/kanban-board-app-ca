import { EntityValidationError } from "@errors/entity-validation.error";
import { Id } from "./id.vo";

export class BoardId extends Id<"BoardId"> {
  constructor(id: string) {
    if (typeof id !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_BOARD_ID",
        "Board id must be a string.",
      );
    if (id.trim().length < 1)
      throw new EntityValidationError(
        "EMPTY_BOARD_ID",
        "Board id cannot be empty.",
      );
    super(id);
  }
}
