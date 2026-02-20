export class User {
  public id: string;

  constructor(params: { id: string }) {
    if (typeof params.id !== "string")
      throw new Error("Valid id is required for a user.");
    params.id = params.id.trim();
    if (params.id.length < 1)
      throw new Error("User Id cannot be an empty string.");

    this.id = params.id;
  }
}
