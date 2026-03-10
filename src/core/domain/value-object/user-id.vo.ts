import { EntityValidationError } from "@errors/entity-validation.error";
import { Id } from "./id.vo";

export class UserId extends Id<"UserId"> {
  constructor(id: string) {
    if (typeof id !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_USER_ID",
        "User id must be a string.",
      );
    if ((id = id.trim()).length < 1)
      throw new EntityValidationError(
        "EMPTY_USER_ID",
        "User id cannot be empty.",
      );
    super(id);
  }
}
