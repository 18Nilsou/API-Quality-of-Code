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

  async update(id: number, input: Omit<Game, 'id'>): Promise<Game | null> {
    const index = this.store.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updatedGame: Game = { ...input, id };
    this.store[index] = updatedGame;
    return updatedGame;
  }
}
