export interface DatabaseRepository {
  create(entry: object): Promise<void>;
  read(id: number): Promise<object | null>;
  update(id: number, entry: object): Promise<void>;
  delete(id: number): Promise<void>;
}
