import { GameService } from '../services/gameService';
import { Game } from '../domain/game';
import { InMemoryGameRepo } from '../adapters/driven/inMemoryGameRepo';

describe('GameService', () => {

    let repo: InMemoryGameRepo;
    let service: GameService;

    beforeEach(() => {
        repo = new InMemoryGameRepo();
        service = new GameService(repo);
    });

    it('listGames retourne la liste fournie par le repo', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true,1), new Game(12, "Game2", "Adventure", false, true, false,2)];
        repo.save(sample[0]);
        repo.save(sample[1]);
        await expect(service.listGames()).resolves.toEqual(sample);
    });

    it('createGame appelle save et retourne le jeu créé', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true);
        const { pegi, name, type, indie, multiplayer, competitive } = input;
        const saved = new Game(pegi, name, type, indie, multiplayer, competitive, 2);
        repo.save(saved);
        await expect(service.createGame(input)).resolves.toEqual(saved);
    });

   it('deleteGame appelle delete du repo avec le bon id', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        repo.save(sample[0]);
        const idToDelete = 1;
        await expect(service.deleteGame(idToDelete)).resolves.toEqual(true);
    });

    it('deleteGame appelle delete du repo avec le mauvais id', async () => {
        const idToDelete = 999;
        await expect(service.deleteGame(idToDelete)).resolves.toEqual(false);
    });

    it('updateGame appelle update du repo et retourne le jeu mis à jour', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        repo.save(input);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        await expect(service.updateGame(1, updatedGame)).resolves.toEqual(updatedGame);
    });

    it('updateGame appelle update du repo avec un mauvais id', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        repo.save(input);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        await expect(service.updateGame(99, updatedGame)).resolves.toBeNull();
    });

});
