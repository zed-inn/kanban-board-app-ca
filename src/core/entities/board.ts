export class Board {
  private id: string;
  private name: string;
  private ownerId: string;

  constructor(params: { id: string; name: string; ownerId: string }) {
    if (typeof params.id !== "string") throw new Error("Invalid board id.");
    params.id = params.id.trim();
    if (params.id.length < 1) throw new Error("Board Id cannot be empty.");

    this.id = params.id;

    if (typeof params.name !== "string") throw new Error("Invalid board name.");
    params.name = params.name.trim();
    if (params.name.length < 1) throw new Error("Board name cannot be empty.");

    this.name = params.name;

    if (typeof params.ownerId !== "string")
      throw new Error("Invalid owner id.");
    params.ownerId = params.ownerId.trim();
    if (params.ownerId.length < 1) throw new Error("Owner id cannot be empty.");

    this.ownerId = params.ownerId;
  }

  public get attrbs() {
    return { id: this.id, name: this.name, ownerId: this.ownerId };
  }

  public updateName = (name: string) => {
    if (typeof name !== "string") throw new Error("Invalid board name.");
    name = name.trim();
    if (name.length < 1) throw new Error("Board name cannot be empty.");

    this.name = name;
  };

  public transferOwnershipTo = (ownerId: string) => {
    if (typeof ownerId !== "string") throw new Error("Invalid owner id.");
    ownerId = ownerId.trim();
    if (ownerId.length < 1) throw new Error("Owner id cannot be empty.");

    if (ownerId === this.ownerId)
      throw new Error("Ownership transfer to self is not allowed.");

    this.ownerId = ownerId;
  };
}
