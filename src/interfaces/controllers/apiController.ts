import { FetchApiUseCase } from "../../usecases/FetchApiUseCase";

export class ApiController {
  constructor(private fetchApiUseCase: FetchApiUseCase) {}

  async fetchAllApi(): Promise<unknown> {
    const result = await this.fetchApiUseCase.execute();
    return result;
  }
}
