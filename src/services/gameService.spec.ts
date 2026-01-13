import { GameService } from './gameService';
import { Game } from '../domain/game';
import { mock } from 'node:test';

describe('GameService', () => {

    let mockRepo: {
        findAll: jest.Mock<Promise<Game[]>, []>;
        save: jest.Mock<Promise<Game>, [Omit<Game, 'id'>]>;
        delete: jest.Mock<Promise<boolean>, [number]>;
        update: jest.Mock<Promise<Game>, [Partial<Game>]>;
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

    it('updateGame appelle update du repo et retourne le jeu mis à jour', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true, 1);
        const updatedGame = new Game(18, "Game1 Updated", "Action", true, false, true, 1);
        mockRepo.update.mockResolvedValue(updatedGame);
        await expect(service.updateGame(input)).resolves.toEqual(updatedGame);
        expect(mockRepo.update).toHaveBeenCalledWith(input);
    });
});
