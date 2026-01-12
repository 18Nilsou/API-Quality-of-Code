import { Game } from '../../domain/game';
import { GameRepositoryPort } from '../../ports/driven/repoPort';

const store: Game[] = [];

export class InMemoryGameRepo implements GameRepositoryPort {
  async findAll(): Promise<Game[]> {
    return store.slice();
  }

  async findById(id: number): Promise<Game | null> {
    const found = store.find((s) => s.id === id);
    return found ?? null;
  }

  async save(game: Omit<Game, 'id'>): Promise<Game> {
    const newGame: Game = { ...game, id: store.length + 1};
    store.push(newGame);
    return newGame;
  }

  async delete(id: number): Promise<void> {
    const index = store.findIndex((s) => s.id === id);
    if (index !== -1) {
      store.splice(index, 1);
    }
  }

  async update(game: Game): Promise<Game> {
    const index = store.findIndex((s) => s.id === game.id);
    if (index === -1) {
      throw new Error('Game not found');
    }
    store[index] = game;
    return game;
  }
}
