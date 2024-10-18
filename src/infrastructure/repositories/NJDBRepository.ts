import { DatabaseRepository } from "domain/repositories/DatabaseRepository";
import { JsonDB, Config } from "node-json-db";

const db = new JsonDB(new Config("myDataBase", true, false, "/"));

export class NJDBRepository implements DatabaseRepository {
  async create(entry: unknown): Promise<void> {
    try {
      return db.push("/entries[]", entry, true);
    } catch (error) {
      console.error("Error creating entry:", error);
      throw error;
    }
  }

  async read(id: number): Promise<unknown> {
    try {
      return db.getObject("/entries[" + id + "]");
    } catch (error) {
      console.error("Error reading entry:", error);
      throw error;
    }
  }

  async update(id: number, entry: unknown): Promise<void> {
    try {
      return db.push("/entries[" + id + "]", entry, true);
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      return db.delete("/entries[" + id + "]");
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  }
}
