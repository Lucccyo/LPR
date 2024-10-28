import { User } from "domain/entities/user";
import { UserCharacter } from "domain/entities/userCharacter";

export interface UserCharacterRepository {
  fetchAllByUser(user: User): Promise<UserCharacter[]>;
}
