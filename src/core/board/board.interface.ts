import type { User } from "../user/user.entity";

export interface BoardAttributes {
  id: string;
  name: string;
  owner: User;
  members: [User, ...User[]];
}
