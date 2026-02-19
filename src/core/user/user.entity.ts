import type { UserAttributes } from "./user.interface";

export class User {
  public id;

  constructor(data: UserAttributes) {
    this.id = data.id;
  }
}
