import { FetchApiUseCase } from "../../usecases/FetchApiUseCase";
import { ApiFactory } from "../../infrastructure/factories/apiFactory";

export class ApiController {
  private fetchApiUseCase: FetchApiUseCase = new FetchApiUseCase(ApiFactory.createApiRepository());
  
  async fetchAllApi(): Promise<any> {
    const result = await this.fetchApiUseCase.execute();
    return result;
  }
}
