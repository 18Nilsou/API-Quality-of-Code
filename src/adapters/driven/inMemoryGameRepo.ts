import { Game } from '../../domain/game';
import { GameRepositoryPort } from '../../ports/driven/repoPort';

export class InMemoryGameRepo implements GameRepositoryPort {

  constructor(private readonly store: Game[] = []) {}

  async findAll(): Promise<Game[]> {
    return this.store.slice();
  }

  async save(game: Omit<Game, 'id'>): Promise<Game> {
    const newGame: Game = { ...game, id: this.store.length + 1};
    this.store.push(newGame);
    return newGame;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.store.splice(index, 1);
      return true;
    }
    return false;
  }

  async update(game: Game): Promise<Game> {
    const index = this.store.findIndex((s) => s.id === game.id);
    if (index === -1) {
      throw new Error('Game not found');
    }
    this.store[index] = game;
    return game;
  }
}
