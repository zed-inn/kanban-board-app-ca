import { EntityValidationError } from "@errors/entity-validation.error";
import { Id } from "./id.vo";

export class ColumnId extends Id<"ColumnId"> {
  constructor(id: string) {
    if (typeof id !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_COLUMN_ID",
        "Column id must be a string.",
      );
    if ((id = id.trim()).length < 1)
      throw new EntityValidationError(
        "EMPTY_COLUMN_ID",
        "Column id cannot be empty.",
      );
    super(id);
  }
}
