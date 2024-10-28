import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { JsonDB, Config, DataError } from "node-json-db";

const db = new JsonDB(new Config("database", true, true, "/"));

export class NJDBRepository implements DatabaseRepository {
  async create(entry: object): Promise<void> {
    return await db.push("/entries", entry, true);
  }

  async read(id: number): Promise<object | null> {
    try {
      return await db.getObject(`/entries/${id}`);
    } catch (error) {
      if (error instanceof DataError) {
        return null; // entry not found
      } else {
        throw error;
      }
    }
  }

  async update(id: number, entry: object): Promise<void> {
    return await db.push(`/entries/${id}`, entry, true);
  }

  async delete(id: number): Promise<void> {
    return await db.delete(`/entries/${id}`);
  }
}
