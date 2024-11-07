import { FetchApiUseCase } from "../../usecases/FetchApiUseCase";
import { ApiFactory } from "../../infrastructure/factories/apiFactory";

export class ApiController {
  private fetchApiUseCase: FetchApiUseCase = new FetchApiUseCase(ApiFactory.createApiRepository());

  async fetchAllApi(): Promise<object> {
    const result = await this.fetchApiUseCase.fetchAll();
    return result;
  }
}
