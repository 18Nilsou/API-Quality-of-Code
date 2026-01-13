import { GameController } from './gameController';
import { Game } from '../../domain/game';
import { NotFoundError } from '../../domain/error/notFoundError';
import { BadRequestError } from '../../domain/error/badRequestError';
import { AggregateController } from './aggregateController';
import { Data } from '../../domain/data';
import { User } from '../../domain/user';

describe('AggregateController', () => {
    
    let mockPort: {
        listData: jest.Mock<Promise<Data>, []>;
        listPoliticalOpinionsPerGameType: jest.Mock<Promise<string[]>, []>;
    };
    
    let controller: AggregateController;

    beforeEach(() => {
        mockPort = {
            listData: jest.fn(),
            listPoliticalOpinionsPerGameType: jest.fn(),
        };
        controller = new AggregateController(mockPort);
    });

    it('getAllData retourne toutes les données', async () => {
        const gameList = [new Game(18, "Game1", "Action", true, false, true),
            new Game(12, "Game2", "Adventure", false, true, false),
            ];
        const userList = [new User(25, 'M', 'Engineer', 'PS', 'French', ["Game1"], 1),
            new User(30, 'F', 'Unemployed', 'PS', 'French', ["Game2"], 2),
            new User(22, 'M', 'Student', 'LFI', 'French', ["Game1"], 3),
            new User(28, 'F', 'Artist', 'PS', 'French', ["Game2"], 4),
            new User(35, 'M', 'Teacher', 'PS', 'French', ["Game2"], 5),
            new User(40, 'F', 'Doctor', 'LFI', 'French', ["Game1"], 6),
            ];
        const sample = new Data(
            gameList,
            userList
        );

        mockPort.listData.mockResolvedValue(sample);

        const mockReq = {} as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;

        await controller.getAllData(mockReq, mockRes);

        expect(mockPort.listData).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(sample);
    });


    it('listPoliticalOpinionsPerGameType retourne le top 3 des partie politique en fonction du type de jeu', async () => {
        const gameList = [new Game(18, "Game1", "Action", true, false, true),
            ];
        const userList = [new User(25, 'M', 'Engineer', 'PS', 'French', ["Game1"], 1),
            new User(30, 'F', 'Unemployed', 'PS', 'French', ["Game1"], 2),
            new User(22, 'M', 'Student', 'LFI', 'French', ["Game1"], 3),
            new User(28, 'F', 'Artist', 'PS', 'French', ["Game1"], 4),
            new User(35, 'M', 'Teacher', 'PS', 'French', ["Game1"], 5),
            new User(40, 'F', 'Doctor', 'LFI', 'French', ["Game1"], 6),
            ];
        const sample = ['PS', 'LFI', 'Reconquête'];

        mockPort.listPoliticalOpinionsPerGameType.mockResolvedValue(sample);

        const mockReq = {
            params: { type: 'Action' },
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;

        await controller.getPoliticalOpinionsPerGameType(mockReq, mockRes);

        expect(mockPort.listPoliticalOpinionsPerGameType).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(sample);
    });
});