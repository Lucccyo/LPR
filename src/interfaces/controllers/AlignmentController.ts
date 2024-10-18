import { FetchAlignmentsUseCase } from "../../usecases/FetchAlignmentsUseCase";
import { Alignment } from "../../domain/entities/alignment";

export class AlignmentController {
  constructor(private fetchAlignmentUseCase: FetchAlignmentsUseCase) {}

  async fetchAllAlignments(): Promise<Alignment[]> {
    const alignment = await this.fetchAlignmentUseCase.execute();
    return alignment;
  }
}