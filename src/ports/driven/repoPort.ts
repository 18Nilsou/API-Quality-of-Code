import { Address } from '../../domain/address';
import { Game } from '../../domain/game';

export interface AddressRepositoryPort {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  save(address: Omit<Address, 'id'>): Promise<Address>;
}

export interface GameRepositoryPort {
  findAll(): Promise<Game[]>;
  findById(id: number): Promise<Game | null>;
  save(game: Omit<Game, 'id'>): Promise<Game>;
  delete(id: number): Promise<void>;
  update(game: Game): Promise<Game>;
}