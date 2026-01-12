import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepoPort';

const store: User[] = [];

export class InMemoryUserRepo implements UserRepositoryPort {
    async findAll(): Promise<User[]> {
        return store.slice();
    }

    async findById(id: number): Promise<User | null> {
        const found = store.find((s) => s.id === id);
        return found ?? null;
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const newUser: User = { ...user, id: store.length + 1 };
        store.push(newUser);
        return newUser;
    }

    async update(id: number, user: Omit<User, 'id'>): Promise<User | null> {
        const index = store.findIndex((s) => s.id === id);
        if (index === -1) return null;
        const updatedUser: User = { ...user, id };
        store[index] = updatedUser;
        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const index = store.findIndex((s) => s.id === id);
        if (index === -1) return false;
        store.splice(index, 1);
        return true;
    }
}