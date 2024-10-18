import { AlignmentRepository } from "../../domain/repositories/AlignmentRepository";
import { Alignment } from "../../domain/entities/alignment";

export class DndApiAlignmentRepository implements AlignmentRepository {
  private readonly apiUrl = "https://www.dnd5eapi.co/api/alignments";

  public async fetchAll(): Promise<Alignment[]> {
    const response = await fetch(this.apiUrl);
    const data = await response.json() as { results: { index: string; name: string }[] };
    const alignments = data.results.map((alignment: { index: string; name: string }) => {
      return new Alignment(alignment.index, alignment.name);
    });

    return alignments;
  }
}