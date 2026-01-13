import { InMemoryUserRepo } from "../adapters/driven/inMemoryUserRepo";
import { User } from "../domain/user";

describe('userInMemoryIntegration', () => {
    let repo: InMemoryUserRepo;
    let users: User[] = [];

    beforeEach(async () => {
        users = [];
        repo = new InMemoryUserRepo(users);
    })

    it('should save a user', async () => {
        const userData = new User(25, 'M', 'Engineer', 'Reconquête', 'French');
        const savedUser = await repo.save(userData);
        const users = await repo.findAll();

        expect(savedUser).toHaveProperty('id');
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(savedUser);
    });

    it('should update a user', async () => {
        const userData = new User(25, 'M', 'Engineer', 'Reconquête', 'French');
        const savedUser = await repo.save(userData);
        const tempUsers = await repo.findAll();
        const updatedData = new User(26, 'M', 'Engineer', 'Reconquête', 'French', savedUser.id);
        const updatedUser = await repo.update(savedUser.id!, updatedData);
        const users = await repo.findAll();

        expect(updatedUser).not.toBeNull();
        expect(updatedUser?.age).toBe(26);
        expect(users.length).toBe(1);
        expect(tempUsers[0]).toEqual(savedUser);
        expect(users[0]).toEqual(updatedUser);
    });

    it('should return null when updating a non-existing user', async () => {
        const updatedData = new User(26, 'M', 'Engineer', 'Reconquête', 'French', 999);
        const result = await repo.update(999, updatedData);

        expect(result).toBeNull();
    });

    it('should delete a user', async () => {
        const userData = new User(25, 'M', 'Engineer', 'Reconquête', 'French');
        const savedUser = await repo.save(userData);
        const tempUsers = await repo.findAll();
        const deleted = await repo.delete(savedUser.id!);
        const users = await repo.findAll();

        expect(deleted).toBe(true);
        expect(tempUsers.length).toBe(1);
        expect(users.length).toBe(0);
    });

    it('should return false when deleting a non-existing user', async () => {
        const result = await repo.delete(999);

        expect(result).toBe(false);
    });
});