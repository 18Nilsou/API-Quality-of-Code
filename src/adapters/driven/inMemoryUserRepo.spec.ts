import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/userRepoPort';
import { InMemoryUserRepo } from './inMemoryUserRepo';

describe('inMemoryUserRepo', () => {
    let repo: InMemoryUserRepo;
    let users: User[] = [];

    beforeEach(async () => {
        users = [];
        repo = new InMemoryUserRepo(users);
    })

    it('should save a user', async () => {
        const userData = new User(25, 'M', 'Engineer', 'Reconquête', 'French');
        const savedUser = await repo.save(userData);

        expect(savedUser).toHaveProperty('id');
        expect(savedUser.politicalOpinion).toBe(userData.politicalOpinion);
        expect(users.length).toBe(1);
    });

    it('should get all users by duplicating variable', async () => {
        users = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', 1)];
        repo = new InMemoryUserRepo(users);
        const allUsers = await repo.findAll();

        expect(allUsers).toEqual(users);
        expect(allUsers).not.toBe(users); // Ensure it's a copy
    });

    it('should update an existing user', async () => {
        users = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', 1)];
        repo = new InMemoryUserRepo(users);
        const updatedData = new User(26, 'M', 'Engineer', 'Reconquête', 'French', 1);
        const updatedUser = await repo.update(1, updatedData);

        expect(updatedUser).not.toBeNull();
        expect(updatedUser).toHaveProperty('id');
        expect(updatedUser?.politicalOpinion).toBe(updatedData.politicalOpinion);
    });

    it('should return null when updating a non-existing user', async () => {
        const updatedData = new User(26, 'M', 'Engineer', 'Reconquête', 'French', 1);
        const result = await repo.update(999, updatedData);

        expect(result).toBeNull();
    });

    it('should delete an existing user', async () => {
        users = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', 1)];
        repo = new InMemoryUserRepo(users);
        const result = await repo.delete(1);

        expect(result).toBe(true);
        expect(users.length).toBe(0);
    });

    it('should return false when deleting a non-existing user', async () => {
        const result = await repo.delete(999);

        expect(result).toBe(false);
    });
})