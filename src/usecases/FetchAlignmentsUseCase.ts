import { Alignment } from "../domain/entities/alignment";
import { AlignmentRepository } from "../domain/repositories/AlignmentRepository";

export class FetchAlignmentsUseCase {
  constructor(private alignmentRepository: AlignmentRepository) {}

  async execute(): Promise<Alignment[]> {
    const alignmentList = await this.alignmentRepository.fetchAll();
    return alignmentList;
  }
}