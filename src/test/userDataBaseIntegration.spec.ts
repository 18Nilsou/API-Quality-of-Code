import { User } from "../domain/user";
import { PostgresUserRepo } from "../adapters/driven/postgresUserRepo";
import { Pool } from 'pg';
import { UserService } from "../services/userService";

describe('usersDataBaseIntegration', () => {

    let repo: PostgresUserRepo;
    let service: UserService;
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
        await testPool.query('TRUNCATE users RESTART IDENTITY CASCADE');
        
        repo = new PostgresUserRepo(testPool);
        service = new UserService(repo);
    });

    afterAll(async () => {
        // Close only the test pool, not the shared pool
        await testPool.end();
    });

    it('listUsers retourne la liste fournie par le repo', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        await repo.save(sample[0]);
        await repo.save(sample[1]);
        await expect(service.listUsers()).resolves.toEqual(sample);
    });

    it('createUser appelle save et retourne l\'utilisateur créé', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', []);
        const { age, sex, job, politicalOpinion, nationality, favoriteGames } = input;
        const saved = new User(age, sex, job, politicalOpinion, nationality, favoriteGames, 1);
        await expect(service.createUser(input)).resolves.toEqual(saved);
    });

    it('updateUser appelle update et retourne l\'utilisateur mis à jour', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        await repo.save(input);
        const { age, sex, job, politicalOpinion, nationality, favoriteGames, id } = input;
        const updated = new User(age, sex, 'Unemployed', politicalOpinion, nationality, favoriteGames, id);
        await repo.update(1, updated);
        await expect(service.updateUser(1, updated)).resolves.toEqual(updated);
    });

    it('updateUser retourne null si l\'utilisateur n\'existe pas', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        await repo.update(999, input);
        await expect(service.updateUser(999, input)).resolves.toBeNull();
    });

    it('deleteUser appelle delete et retourne true si l\'utilisateur a été supprimé', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        await repo.save(sample[0]);
        await repo.save(sample[1]);
        await expect(service.deleteUser(1)).resolves.toBe(true);
    });

    it('deleteUser retourne false si l\'utilisateur n\'existe pas', async () => {
        await repo.delete(999);
        await expect(service.deleteUser(999)).resolves.toBe(false);
    });
});