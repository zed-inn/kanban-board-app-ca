export class Board {
  public id: string;
  public name: string;
  public ownerId: string;
  public memberIds: string[];

  constructor(params: {
    id: string;
    name: string;
    ownerId: string;
    memberIds?: string[];
  }) {
    if (typeof params.id !== "string")
      throw new Error("Valid id is required for a board.");
    params.id = params.id.trim();
    if (params.id.length < 1)
      throw new Error("Board Id cannot be an empty string.");

    this.id = params.id;

    if (typeof params.name !== "string")
      throw new Error("Valid board name is required for a board.");
    params.name = params.name.trim();
    if (params.name.length < 1)
      throw new Error("Board name cannot be an empty string.");

    this.name = params.name;

    if (typeof params.ownerId !== "string")
      throw new Error("Valid ownerId is required for a board.");
    params.ownerId = params.ownerId.trim();
    if (params.ownerId.length < 1)
      throw new Error("OwnerId cannot be an empty string.");

    this.ownerId = params.ownerId;

    params.memberIds ??= [];
    if (!Array.isArray(params.memberIds))
      throw new Error("Invalid memberIds are given.");

    let memberIdsSet = new Set(params.memberIds);
    memberIdsSet.add(this.ownerId);
    params.memberIds = Array.from(memberIdsSet);

    if (params.memberIds.length < 1)
      throw new Error("Atleast one member is required for a board.");

    for (let i = 0; i < params.memberIds.length; i++) {
      let memberId = params.memberIds[i];
      if (typeof memberId !== "string")
        throw new Error("Invalid member id is given.");
      memberId = memberId.trim();
      params.memberIds[i] = memberId;
    }

    this.memberIds = params.memberIds;
  }
}
