export class User {
  private id: string;

  constructor(params: { id: string }) {
    if (typeof params.id !== "string") throw new Error("Invalid user id.");
    params.id = params.id.trim();
    if (params.id.length < 1) throw new Error("User id cannot be empty.");

    this.id = params.id;
  }

  getAttrbs = () => ({ id: this.id });
}
