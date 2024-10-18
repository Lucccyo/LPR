import { DndApiRepository } from "../repositories/dndApiRepository";

export class ApiFactory {
    static createApiRepository(): DndApiRepository {
        return new DndApiRepository();
    }
}