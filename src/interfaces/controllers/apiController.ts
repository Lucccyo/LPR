import { FetchApiUseCase } from "../../usecases/FetchApiUseCase";

export class ApiController {
  constructor(private fetchApiUseCase: FetchApiUseCase) {}

  async fetchAllApi(): Promise<any> {
    const result = await this.fetchApiUseCase.execute();
    return result;
  }
}