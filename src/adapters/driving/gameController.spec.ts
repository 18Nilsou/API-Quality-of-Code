import { GameController } from './gameController';
import { Game } from '../../domain/game';
import { NotFoundError } from '../../domain/error/notFoundError';
import { BadRequestError } from '../../domain/error/badRequestError';

describe('GameController', () => {
    let mockPort: {
        listGames: jest.Mock<Promise<Game[]>, []>;
        createGame: jest.Mock<Promise<Game>, [Omit<Game, 'id'>]>;
        updateGame: jest.Mock<Promise<Game | null>, [number, Omit<Game, 'id'>]>;
        deleteGame: jest.Mock<Promise<boolean>, [number]>;
    };
    let controller: GameController;

    beforeEach(() => {
        mockPort = {
            listGames: jest.fn(),
            createGame: jest.fn(),
            updateGame: jest.fn(),
            deleteGame: jest.fn(),
        };
        controller = new GameController(mockPort);
    });

    it('listGames retourne la liste des jeux', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true,1), new Game(18, "Game1", "Action", true, false, true,2)];
        mockPort.listGames.mockResolvedValue(sample);

        const mockReq = {} as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;

        await controller.getAllGames(mockReq, mockRes);

        expect(mockPort.listGames).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(sample);
    });

    it('createGame crée un jeu et le retourne', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true);
        const saved = new Game(18, "Game1", "Action", true, false, true);
        mockPort.createGame.mockResolvedValue(saved);

        const mockReq = {
            body: input,
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.createGame(mockReq, mockRes, mockNext);

        expect(mockPort.createGame).toHaveBeenCalledWith(input);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(saved);
    });

    it('createGame renvoie une erreur si les données sont erronées', async () => {
        const mockReq = {
            body: { pegi: 18, name: "Game1", genre: "Action", multiplayer: true, singleplayer: false, online: true, rating: 1 },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.createGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('pegi, name, type, indie, multiplayer, and competitive required'));
    });

    it('updateGame met à jour un jeu existant et le retourne', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true,1);
        const updated = new Game(18, "Game1", "Action", true, false, true,1);
        mockPort.updateGame.mockResolvedValue(updated);

        const mockReq = {
            params: { id: '1' },
            body: input,
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.updateGame(mockReq, mockRes, mockNext);

        expect(mockPort.updateGame).toHaveBeenCalledWith(1, input);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(updated);
    });

    it('updateGame renvoie une erreur si les données sont erronées', async () => {
        const mockReq = {
            params: { id: '1' },
            body: { pegi: 18, name: "Game1", genre: "Action", multiplayer: true, singleplayer: false, online: true, rating: 1 },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('pegi, name, type, indie, multiplayer, and competitive required'));
    });

    it('updateGame renvoie une erreur si l\'ID est invalide', async () => {
        const mockReq = {
            params: { id: 'abc' },
            body: {},
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Game ID must be a number'));
    });

    it('updateGame renvoie une erreur si le jeu n\'existe pas', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true,1);
        mockPort.updateGame.mockResolvedValue(null);
        const mockReq = {
            params: { id: '999' },
            body: input,
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Game not found'));
    });

    it('deleteGame supprime un jeu existant', async () => {
        mockPort.deleteGame.mockResolvedValue(true);

        const mockReq = {
            params: { id: '1' },
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.deleteGame(mockReq, mockRes, mockNext);

        expect(mockPort.deleteGame).toHaveBeenCalledWith(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
    });

    it('deleteGame renvoie une erreur si l\'ID est invalide', async () => {
        const mockReq = {
            params: { id: 'abc' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.deleteGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Game ID must be a number'));
    });

    it('deleteGame renvoie une erreur si le jeu n\'existe pas', async () => {
        mockPort.deleteGame.mockResolvedValue(false);
        const mockReq = {
            params: { id: '999' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.deleteGame(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Game not found'));
    });
});