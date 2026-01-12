import { Address } from '../../domain/address';
import { Game } from '../../domain/game';

export interface AddressPort {
  listAddresses(): Promise<Address[]>;
  getAddress(id: string): Promise<Address | null>;
  createAddress(input: Omit<Address, 'id'>): Promise<Address>;
}

export interface GamePort {
  listGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | null>;
  createGame(input: Omit<Game, 'id'>): Promise<Game>;
  updateGame(game: Game): Promise<Game>;
  deleteGame(id: number): Promise<void>;
}