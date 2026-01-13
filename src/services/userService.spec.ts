import { UserService } from './userService';
import { User } from '../domain/user';

describe('UserService', () => {
    let mockRepo: {
        findAll: jest.Mock<Promise<User[]>, []>;
        save: jest.Mock<Promise<User>, [Omit<User, 'id'>]>;
        update: jest.Mock<Promise<User | null>, [number, Omit<User, 'id'>]>;
        delete: jest.Mock<Promise<boolean>, [number]>;
    };
    let service: UserService;

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        service = new UserService(mockRepo);
    });

    it('listUsers retourne la liste fournie par le repo', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        mockRepo.findAll.mockResolvedValue(sample);
        await expect(service.listUsers()).resolves.toEqual(sample);
        expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('createUser appelle save et retourne l\'utilisateur créé', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', []);
        const { age, sex, job, politicalOpinion, nationality, favoriteGames } = input;
        const saved = new User(age, sex, job, politicalOpinion, nationality, favoriteGames, 1);
        mockRepo.save.mockResolvedValue(saved);
        await expect(service.createUser(input)).resolves.toEqual(saved);
        expect(mockRepo.save).toHaveBeenCalledWith(input);
    });

    it('updateUser appelle update et retourne l\'utilisateur mis à jour', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        const { age, sex, job, politicalOpinion, nationality, favoriteGames, id } = input;
        const updated = new User(age, sex, 'Unemployed', politicalOpinion, nationality, favoriteGames, id);
        mockRepo.update.mockResolvedValue(updated);
        await expect(service.updateUser(1, input)).resolves.toEqual(updated);
        expect(mockRepo.update).toHaveBeenCalledWith(1, input);
    });

    it('updateUser retourne null si l\'utilisateur n\'existe pas', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        mockRepo.update.mockResolvedValue(null);
        await expect(service.updateUser(999, input)).resolves.toBeNull();
        expect(mockRepo.update).toHaveBeenCalledWith(999, input);
    });

    it('deleteUser appelle delete et retourne true si l\'utilisateur a été supprimé', async () => {
        mockRepo.delete.mockResolvedValue(true);
        await expect(service.deleteUser(1)).resolves.toBe(true);
        expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('deleteUser retourne false si l\'utilisateur n\'existe pas', async () => {
        mockRepo.delete.mockResolvedValue(false);
        await expect(service.deleteUser(999)).resolves.toBe(false);
        expect(mockRepo.delete).toHaveBeenCalledWith(999);
    });
});