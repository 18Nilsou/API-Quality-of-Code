import { Address } from '../../domain/address';
import { Game } from '../../domain/game';

export interface AddressPort {
  listAddresses(): Promise<Address[]>;
  getAddress(id: string): Promise<Address | null>;
  createAddress(input: Omit<Address, 'id'>): Promise<Address>;
}

export interface GamePort {
  listGames(): Promise<Game[]>;
  createGame(input: Omit<Game, 'id'>): Promise<Game>;
  updateGame(id: number, input: Omit<Game, 'id'>): Promise<Game | null>;
  deleteGame(id: number): Promise<boolean>;
}