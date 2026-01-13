import { Game } from "../domain/game";
import { User } from "../domain/user";
import { InMemoryGameRepo } from "../adapters/driven/inMemoryGameRepo";
import { InMemoryUserRepo } from "../adapters/driven/inMemoryUserRepo";
import { AggregateService } from "../services/aggregateService";

describe('aggregateInMemoryIntegration', () => {
    let userRepo: InMemoryUserRepo;
    let gameRepo: InMemoryGameRepo;
    let aggregateService: AggregateService;

    beforeEach(async () => {
        userRepo = new InMemoryUserRepo();
        gameRepo = new InMemoryGameRepo();
        aggregateService = new AggregateService(userRepo, gameRepo);

    })

    it('should get all data', async () => {
        const userData = [
            new User(25, 'M', 'Engineer', 'Reconquête', 'French', ['Game1', 'Game2']),
            new User(30, 'F', 'Unemployed', 'RN', 'French', ['Game1'])
        ];
        const gameData = [
            new Game(18, "Game1", "Action", true, false, true),
            new Game(12, "Game2", "Adventure", false, true, false)
        ];
        userData.forEach(user => {
            userRepo.save(user);
        });
        gameData.forEach(game => {
            gameRepo.save(game);
        });

        const data = await aggregateService.listData();

        expect(data.users.length).toBe(2);
        expect(data.games.length).toBe(2);
    });

    it('should aggregate political opinions per game type', async () => {
        const userData: User[] = [
            new User(25, 'M', 'Engineer', 'Reconquête', 'French', ['Game1', 'Game2'], 1),
            new User(30, 'F', 'Unemployed', 'RN', 'French', ['Game1'], 2),
            new User(22, 'M', 'Student', 'Reconquête', 'French', ['Game1'], 3),
            new User(28, 'F', 'Teacher', 'Ecologie Les Verts', 'French', ['Game2'], 4),
            new User(35, 'M', 'Doctor', 'Reconquête', 'French', ['Game2', 'Game1'], 5),
            new User(40, 'F', 'Lawyer', 'Ecologie Les Verts', 'French', ['Game1'], 6),
            new User(27, 'M', 'Artist', 'RN', 'French', ['Game2', 'Game1'], 7),
            new User(32, 'F', 'Engineer', 'LFI', 'French', ['Game2'], 8),
        ];
        const gameData: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        userData.forEach(user => {
            userRepo.save(user);
        });
        gameData.forEach(game => {
            gameRepo.save(game);
        });

        const aggregation = await aggregateService.listPoliticalOpinionsPerGameType("Action");

        expect(aggregation).toEqual(["Reconquête", "RN", "Ecologie Les Verts"]);
    });
});