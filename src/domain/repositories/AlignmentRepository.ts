import { Alignment } from "../entities/alignment";

export interface AlignmentRepository {
  fetchAll(): Promise<Alignment[]>;
}