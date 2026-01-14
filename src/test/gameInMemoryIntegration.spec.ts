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
        await repo.save(sample[0]);
        await repo.save(sample[1]);
        await expect(service.listGames()).resolves.toEqual(sample);
    });

    it('createGame appelle save et retourne le jeu créé', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true);
        const result = await service.createGame(input);
        expect(result).toMatchObject({
            pegi: input.pegi,
            name: input.name,
            type: input.type,
            indie: input.indie,
            multiplayer: input.multiplayer,
            competitive: input.competitive
        });
        expect(result.id).toBeDefined();
    });

   it('deleteGame appelle delete du repo avec le bon id', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        await repo.save(sample[0]);
        const idToDelete = 1;
        await expect(service.deleteGame(idToDelete)).resolves.toEqual(true);
    });

    it('deleteGame appelle delete du repo avec le mauvais id', async () => {
        const idToDelete = 999;
        await expect(service.deleteGame(idToDelete)).resolves.toEqual(false);
    });

    it('updateGame appelle update du repo et retourne le jeu mis à jour', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        await repo.save(input);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        await expect(service.updateGame(1, updatedGame)).resolves.toEqual(updatedGame);
    });

    it('updateGame appelle update du repo avec un mauvais id', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        await repo.save(input);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        await expect(service.updateGame(99, updatedGame)).resolves.toBeNull();
    });

});
