import { Game } from '../domain/game';
import { GameRepositoryPort } from '../ports/driven/repoPort';
import { GamePort } from "../ports/driving/gamePort";

export class GameService implements GamePort {

  constructor(private repo: GameRepositoryPort) { }

  async listGames(): Promise<Game[]> {
    return this.repo.findAll();
  }

  async createGame(input: Omit<Game, 'id'>): Promise<Game> {
    return this.repo.save(input);
  }

  async updateGame(id: number, input: Omit<Game, 'id'>): Promise<Game | null> {
    return this.repo.update(id, input);
  }

  async deleteGame(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}
