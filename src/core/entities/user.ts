export class User {
  private _id: string;

  constructor(params: { id: string }) {
    if (typeof params.id !== "string") throw new Error("Invalid user id.");
    params.id = params.id.trim();
    if (params.id.length < 1) throw new Error("User id cannot be empty.");

    this._id = params.id;
  }

  public get attrbs() {
    return { id: this._id };
  }

  public get id() {
    return this._id;
  }
}
