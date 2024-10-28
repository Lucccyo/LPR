import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { NJDBRepository } from "../../infrastructure/repositories/NJDBRepository";

export class DatabaseFactory {
  getRepository(): DatabaseRepository {
    return new NJDBRepository();
  }
}
