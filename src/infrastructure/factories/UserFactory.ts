import { UserRepository } from "domain/repositories/UserRepository";

export class UserFactory {
    static getRepository: UserRepository {
        return new NJDBRepository();
    }
}
