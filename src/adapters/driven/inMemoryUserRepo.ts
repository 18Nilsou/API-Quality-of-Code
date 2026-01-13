import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepoPort';

export class InMemoryUserRepo implements UserRepositoryPort {
    constructor(private readonly store: User[] = []) { }

    async findAll(): Promise<User[]> {
        return this.store.slice();
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = { ...user, id: this.store.length + 1 };
        this.store.push(newUser);
        return newUser;
    }

    async update(id: number, user: Omit<User, 'id'>): Promise<User | null> {
        const index = this.store.findIndex((s) => s.id === id);
        if (index === -1) return null;
        const updatedUser: User = { ...user, id };
        this.store[index] = updatedUser;
        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const index = this.store.findIndex((s) => s.id === id);
        if (index === -1) return false;
        this.store.splice(index, 1);
        return true;
    }
}