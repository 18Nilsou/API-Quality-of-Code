import { GameService } from './gameService';
import { Game } from '../domain/game';

describe('GameService', () => {

    let mockRepo: {
        findAll: jest.Mock<Promise<Game[]>, []>;
        save: jest.Mock<Promise<Game>, [Omit<Game, 'id'>]>;
        delete: jest.Mock<Promise<boolean>, [number]>;
        update: jest.Mock<Promise<Game | null>, [number, Omit<Game, 'id'>]>;
    };

    let service: GameService;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        };
        service = new GameService(mockRepo);
    });

    it('listGames retourne la liste fournie par le repo', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        mockRepo.findAll.mockResolvedValue(sample);
        await expect(service.listGames()).resolves.toEqual(sample);
        expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('createGame appelle save et retourne le jeu créé', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true);
        const { pegi, name, type, indie, multiplayer, competitive } = input;
        const saved = new Game(pegi, name, type, indie, multiplayer, competitive, 2);
        mockRepo.save.mockResolvedValue(saved);
        await expect(service.createGame(input)).resolves.toEqual(saved);
        expect(mockRepo.save).toHaveBeenCalledWith(input);
    });

    it('deleteGame appelle delete du repo avec le bon id', async () => {
        const idToDelete = 1;
        mockRepo.delete.mockResolvedValue(true);
        await service.deleteGame(idToDelete);
        expect(mockRepo.delete).toHaveBeenCalledWith(idToDelete);
    });

    it('deleteGame appelle delete du repo avec le mauvais id', async () => {
        const idToDelete = 999;
        mockRepo.delete.mockResolvedValue(false);
        await service.deleteGame(idToDelete);
        expect(mockRepo.delete).toHaveBeenCalledWith(idToDelete);
    });

    it('updateGame appelle update du repo et retourne le jeu mis à jour', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        mockRepo.update.mockResolvedValue(updatedGame);
        await expect(service.updateGame(1, input)).resolves.toEqual(updatedGame);
        expect(mockRepo.update).toHaveBeenCalledWith(1, input);
    });

    it('updateGame appelle update du repo avec un mauvais id', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        mockRepo.update.mockResolvedValue(null);
        await expect(service.updateGame(99, input)).resolves.toBeNull();
        expect(mockRepo.update).toHaveBeenCalledWith(99, input);
    });

});
