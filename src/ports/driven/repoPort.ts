import { Address } from '../../domain/address';
import { Game } from '../../domain/game';
import { User } from '../../domain/user';

export interface AddressRepositoryPort {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  save(address: Omit<Address, 'id'>): Promise<Address>;
}

export interface GameRepositoryPort {
  findAll(): Promise<Game[]>;
  save(game: Omit<Game, 'id'>): Promise<Game>;
  delete(id: number): Promise<boolean>;
  update(id: number, input: Omit<Game, 'id'>): Promise<Game | null>;
}

export interface UserRepositoryPort {
    findAll(): Promise<User[]>;
    save(user: Omit<User, 'id'>): Promise<User>;
    update(id: number, user: Omit<User, 'id'>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}