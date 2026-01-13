import { Game } from '../../domain/game';
import { GameRepositoryPort } from '../../ports/driven/repoPort';
import { InMemoryGameRepo } from './inMemoryGameRepo';

describe('inMemoryGameRepo', () => {
    let repo: InMemoryGameRepo;
    let games: Game[] = [];

    beforeEach(async () => {
        games = [];
        repo = new InMemoryGameRepo(games);
    })

    it('should save a game', async () => {
        const gameData = new Game(18, "Game1", "Action", true, false, true);
        const savedGame = await repo.save(gameData);

        expect(savedGame).toHaveProperty('id');
        expect(savedGame.name).toBe(gameData.name);
        expect(games.length).toBe(1);
    });

    it('should get all games by duplicating variable', async () => {
        games = [new Game(18, "Game1", "Action", true, false, true, 1)];
        repo = new InMemoryGameRepo(games);
        const allGames = await repo.findAll();

        expect(allGames).toEqual(games);
        expect(allGames).not.toBe(games);
    });

    it('should update an existing game', async () => {
        games = [new Game(18, "Game1", "Action", true, false, true, 1)];
        repo = new InMemoryGameRepo(games);
        const updatedData = new Game(18, "Game1", "Adventure", false, true, false, 1);
        const updatedGame = await repo.update(1, updatedData);

        expect(updatedGame).not.toBeNull();
        expect(updatedGame).toHaveProperty('id');
        expect(updatedGame?.name).toBe(updatedData.name);
    });

    it('should return null when updating a non-existing game', async () => {
        const updatedData = new Game(18, "Game1", "Adventure", false, true, false, 1);
        const result = await repo.update(999, updatedData);

        expect(result).toBeNull();
    });

    it('should delete an existing game', async () => {
        games = [new Game(18, "Game1", "Action", true, false, true, 1)];
        repo = new InMemoryGameRepo(games);
        const result = await repo.delete(1);

        expect(result).toBe(true);
        expect(games.length).toBe(0);
    });

    it('should return false when deleting a non-existing game', async () => {
        const result = await repo.delete(999);

        expect(result).toBe(false);
    });
})