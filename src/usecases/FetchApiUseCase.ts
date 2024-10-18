import { ApiRepository } from "../domain/repositories/apiRepository";

export class FetchApiUseCase {
  constructor(private apiRepository: ApiRepository) {}

  async execute(): Promise<any> {
    const result = await this.apiRepository.getAll();
    return result;
  }
}