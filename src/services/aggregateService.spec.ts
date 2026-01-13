import { Data } from "../domain/data";
import { Game } from "../domain/game";
import { User } from "../domain/user";
import { AggregateService } from "./aggregateService";

describe('AggregateService', () => {

    let mockUserRepo: {
        findAll: jest.Mock<Promise<User[]>, []>;
        save: jest.Mock<Promise<User>, [Omit<User, 'id'>]>;
        update: jest.Mock<Promise<User | null>, [number, Omit<User, 'id'>]>;
        delete: jest.Mock<Promise<boolean>, [number]>;
    };
    let mockGameRepo: {
        findAll: jest.Mock<Promise<Game[]>, []>;
        save: jest.Mock<Promise<Game>, [Omit<Game, 'id'>]>;
        delete: jest.Mock<Promise<boolean>, [number]>;
        update: jest.Mock<Promise<Game | null>, [number, Omit<Game, 'id'>]>;
    };
    let service: AggregateService;

    beforeEach(() => {
        mockUserRepo = {
            findAll: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        mockGameRepo = {
            findAll: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        };
        service = new AggregateService(mockUserRepo, mockGameRepo);
    });

    it('listData retourne la liste fournie par les repos', async () => {
        const games: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        const users: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        const data = new Data(games, users);

        mockGameRepo.findAll.mockResolvedValue(games);
        mockUserRepo.findAll.mockResolvedValue(users);

        await expect(service.listData()).resolves.toEqual(data);

        expect(mockGameRepo.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('listPoliticalOpinionsPerGameType retourne les opinions politiques agrégées par type de jeu', async () => {
        const games: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        const users: User[] = [
            new User(25, 'M', 'Engineer', 'Reconquête', 'French', ['Game1', 'Game2'], 1),
            new User(30, 'F', 'Unemployed', 'RN', 'French', ['Game1'], 2),
            new User(22, 'M', 'Student', 'Reconquête', 'French', ['Game1'], 3),
            new User(28, 'F', 'Teacher', 'Ecologie Les Verts', 'French', ['Game2'], 4),
            new User(35, 'M', 'Doctor', 'Reconquête', 'French', ['Game2', 'Game1'], 5),
            new User(40, 'F', 'Lawyer', 'Ecologie Les Verts', 'French', ['Game1'], 6),
            new User(27, 'M', 'Artist', 'RN', 'French', ['Game2', 'Game1'], 7),
            new User(32, 'F', 'Engineer', 'LFI', 'French', ['Game2'], 8),
        ];
        mockGameRepo.findAll.mockResolvedValue(games);
        mockUserRepo.findAll.mockResolvedValue(users);

        await expect(service.listPoliticalOpinionsPerGameType("Action")).resolves.toEqual(["Reconquête", "RN", "Ecologie Les Verts"]);

        expect(mockGameRepo.findAll).toHaveBeenCalledTimes(1);
        expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
    });
});