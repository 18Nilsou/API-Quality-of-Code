import { User } from '../../domain/user';

export interface UserRepositoryPort {
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    save(user: Omit<User, 'id'>): Promise<User>;
    update(id: number, user: Omit<User, 'id'>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}