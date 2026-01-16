import { Game } from "../domain/game";
import { User } from "../domain/user";
import { PostgresUserRepo } from "../adapters/driven/postgresUserRepo";
import { PostgresGameRepo } from "../adapters/driven/postgresGameRepo";
import { AggregateService } from "../services/aggregateService";
import { Pool } from 'pg';

describe('aggregateDataBaseIntegration', () => {

    let userRepo: PostgresUserRepo;
    let gameRepo: PostgresGameRepo;
    let aggregateService: AggregateService;
    let testPool: Pool;

    beforeAll(async () => {
        // First, connect to the default postgres database to create the test database if it doesn't exist
        const adminPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'your_password',
            database: 'postgres', // Connect to default postgres database
        });

        try {
            // Create test database if it doesn't exist
            await adminPool.query('CREATE DATABASE qoc_db_test');
        } catch (error: any) {
            // Database might already exist (error code 42P04), that's ok
            if (error.code !== '42P04') {
                console.error('Error creating test database:', error);
            }
        } finally {
            await adminPool.end();
        }

        // Now create a dedicated pool for this test suite using TEST database
        testPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'your_password',
            database: 'qoc_db_test', // Always use test database
        });
        
        // Create tables if necessary
        await testPool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER generated always as identity PRIMARY KEY,
                pegi INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                indie BOOLEAN NOT NULL,
                multiplayer BOOLEAN NOT NULL,
                competitive BOOLEAN NOT NULL
            );
        `);
        
        await testPool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER generated always as identity PRIMARY KEY,
                age INTEGER NOT NULL,
                sex VARCHAR(10) NOT NULL,
                job VARCHAR(255) NOT NULL,
                political_opinion VARCHAR(255) NOT NULL,
                nationality VARCHAR(100) NOT NULL,
                favorite_games TEXT NOT NULL
            );
        `);
    });

    beforeEach(async () => {
        // Clean tables before each test
        await testPool.query('TRUNCATE users, games RESTART IDENTITY CASCADE');
        
        userRepo = new PostgresUserRepo(testPool);
        gameRepo = new PostgresGameRepo(testPool);
        aggregateService = new AggregateService(userRepo, gameRepo);
    });

    afterAll(async () => {
        // Close only the test pool, not the shared pool
        await testPool.end();
    });

    it('should get all data', async () => {
        const userData = [
            new User(25, 'M', 'Engineer', 'Reconquête', 'French', ['Game1', 'Game2']),
            new User(30, 'F', 'Unemployed', 'RN', 'French', ['Game1'])
        ];
        const gameData = [
            new Game(18, "Game1", "Action", true, false, true),
            new Game(12, "Game2", "Adventure", false, true, false)
        ];
        
        for (const user of userData) {
            await userRepo.save(user);
        }
        for (const game of gameData) {
            await gameRepo.save(game);
        }

        const data = await aggregateService.listData();

        expect(data.users.length).toBe(2);
        expect(data.games.length).toBe(2);
    });

    it('should aggregate political opinions per game type', async () => {
        const userData: User[] = [
            new User(25, 'M', 'Engineer', 'Reconquête', 'French', ['Game1', 'Game2']),
            new User(30, 'F', 'Unemployed', 'RN', 'French', ['Game1']),
            new User(22, 'M', 'Student', 'Reconquête', 'French', ['Game1']),
            new User(28, 'F', 'Teacher', 'Ecologie Les Verts', 'French', ['Game2']),
            new User(35, 'M', 'Doctor', 'Reconquête', 'French', ['Game2', 'Game1']),
            new User(40, 'F', 'Lawyer', 'Ecologie Les Verts', 'French', ['Game1']),
            new User(27, 'M', 'Artist', 'RN', 'French', ['Game2', 'Game1']),
            new User(32, 'F', 'Engineer', 'LFI', 'French', ['Game2']),
        ];
        const gameData: Game[] = [
            new Game(18, "Game1", "Action", true, false, true),
            new Game(12, "Game2", "Adventure", false, true, false)
        ];
        
        for (const user of userData) {
            await userRepo.save(user);
        }
        for (const game of gameData) {
            await gameRepo.save(game);
        }

        const aggregation = await aggregateService.listPoliticalOpinionsPerGameType("Action");

        expect(aggregation).toEqual(["Reconquête", "RN", "Ecologie Les Verts"]);
    });
});