import { Game } from '../domain/game';
import { GameRepositoryPort } from '../ports/driven/repoPort';
import { GamePort } from "../ports/driving/gamePort";

export class GameService implements GamePort {
  constructor(private repo: GameRepositoryPort) {}

  async getGame(id: number): Promise<Game | null> {
    return this.repo.findById(id);
  }

  async updateGame(game: Game): Promise<Game> {
    return this.repo.update(game);
  }
  
  async deleteGame(id: number): Promise<void> {
    return this.repo.delete(id);
  }

  async listGames(): Promise<Game[]> {
     return this.repo.findAll();
  }

  async createGame(input: Omit<Game, 'id'>): Promise<Game> {
    return this.repo.save(input);
  }
}
