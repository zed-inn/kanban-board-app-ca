import { EntityValidationError } from "../errors/entity-validation.error";

export class User {
  private readonly _id: string;

  private static readonly validate = {
    id: (id: string): string => {
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
      return id;
    },
  };

  constructor(params: { id: string }) {
    this._id = User.validate.id(params.id);
  }

  public get data() {
    return { id: this._id };
  }
  public get id() {
    return this._id;
  }
}
