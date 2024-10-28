import { User } from "../entities/user";

export interface UserRepository {
  fetchAll(): Promise<User[]>;
}
