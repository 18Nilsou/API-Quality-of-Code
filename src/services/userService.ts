import { User } from '../domain/user';
import { UserRepositoryPort } from '../ports/driven/repoPort';
import { UserPort } from "../ports/driving/userPort";

export class UserService implements UserPort {

    constructor(private repo: UserRepositoryPort) { }

    async listUsers(): Promise<User[]> {
        return this.repo.findAll();
    }

    async createUser(input: Omit<User, 'id'>): Promise<User> {
        return this.repo.save(input);
    }

    async updateUser(id: number, input: Omit<User, 'id'>): Promise<User | null> {
        return this.repo.update(id, input);
    }

    async deleteUser(id: number): Promise<boolean> {
        return this.repo.delete(id);
    }
}
