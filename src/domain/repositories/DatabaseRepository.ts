export interface DatabaseRepository {
  create(entry: unknown): Promise<void>;
  read(id: number): Promise<unknown>;
  update(id: number, entry: unknown): Promise<void>;
  delete(id: number): Promise<void>;
}
