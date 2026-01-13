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
        games = [new Game(18, "Game1", "Action", true, false, true)];
        repo = new InMemoryGameRepo(games);
        const allGames = await repo.findAll();

        expect(allGames).toEqual(games);
        expect(allGames).not.toBe(games);
    });
})