import { EntityValidationError } from "@errors/entity-validation.error";
import { Id } from "./id.vo";

export class CardId extends Id<"CardId"> {
  constructor(id: string) {
    if (typeof id !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_CARD_ID",
        "Card id must be a string.",
      );
    if ((id = id.trim()).length < 1)
      throw new EntityValidationError(
        "EMPTY_CARD_ID",
        "Card id cannot be empty.",
      );
    super(id);
  }
}
