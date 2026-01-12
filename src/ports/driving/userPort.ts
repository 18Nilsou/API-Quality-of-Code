import { User } from '../../domain/user';

export interface UserPort {
    listUsers(): Promise<User[]>;
    getUser(id: number): Promise<User | null>;
    createUser(input: Omit<User, 'id'>): Promise<User>;
    updateUser(id: number, input: Omit<User, 'id'>): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
}