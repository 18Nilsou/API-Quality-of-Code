import { Game } from '../../domain/game';

export interface GamePort {
  listGames(): Promise<Game[]>;
  createGame(input: Omit<Game, 'id'>): Promise<Game>;
  updateGame(id: number, input: Omit<Game, 'id'>): Promise<Game | null>;
  deleteGame(id: number): Promise<boolean>;
}