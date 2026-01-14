import { Game } from "../domain/game";
import { PostgresGameRepo } from "../adapters/driven/postgresGameRepo";
import { Pool } from 'pg';
import { GameService } from "../services/gameService";

describe('gameDataBaseIntegration', () => {

    let repo: PostgresGameRepo;
    let service: GameService;
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
    });

    beforeEach(async () => {
        // Clean tables before each test
        await testPool.query('TRUNCATE games RESTART IDENTITY CASCADE');
        
        repo = new PostgresGameRepo(testPool);
        service = new GameService(repo);
    });

    afterAll(async () => {
        // Close only the test pool, not the shared pool
        await testPool.end();
    });

    it('listGames retourne la liste fournie par the repo', async () => {
        const sample: Game[] = [new Game(18, "Game1", "Action", true, false, true), new Game(12, "Game2", "Adventure", false, true, false)];
        await repo.save(sample[0]);
        await repo.save(sample[1]);
        const data = await service.listGames();
        expect(data.length).toBe(2);
    });

    it('createGame appelle save et retourne le jeu créé', async () => {
        const input = new Game(18, "Game1", "Action", true, false, true);
        const { pegi, name, type, indie, multiplayer, competitive } = input;
        const saved = new Game(pegi, name, type, indie, multiplayer, competitive, 2);
        await repo.save(saved);
        await expect(service.createGame(input)).resolves.toEqual(saved);
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
