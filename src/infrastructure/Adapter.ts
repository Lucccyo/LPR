import { Alignment } from "./../domain/entities/alignment";

type DataAlignment = {
  results: { index: string; name: string }[];
};

export class Adapter {
  public async deserializeAlignment(response: Response): Promise<Alignment[]> {
    const data = (await response.json()) as DataAlignment;
    const alignments = data.results.map((alignment: { index: string; name: string }) => {
      return new Alignment(alignment.index, alignment.name);
    });
    return alignments;
  }
}

