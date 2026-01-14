import { InMemoryUserRepo } from "../adapters/driven/inMemoryUserRepo";
import { User } from "../domain/user";
import { UserService } from "../services/userService";

describe('userInMemoryIntegration', () => {
        
    let repo : InMemoryUserRepo;
    let service : UserService;

    beforeEach(async () => {
        repo = new InMemoryUserRepo();
        service = new UserService(repo);
    })

    it('listUsers retourne la liste fournie par le repo', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        repo.save(sample[0]);
        repo.save(sample[1]);
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
        repo.save(input);
        const { age, sex, politicalOpinion, nationality, favoriteGames, id } = input;
        const updated = new User(age, sex, 'Unemployed', politicalOpinion, nationality, favoriteGames, id);
        repo.update(1, updated);
        await expect(service.updateUser(1, updated)).resolves.toEqual(updated);
    });

    it('updateUser retourne null si l\'utilisateur n\'existe pas', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        repo.update(999, input);
        await expect(service.updateUser(999, input)).resolves.toBeNull();
    });

    it('deleteUser appelle delete et retourne true si l\'utilisateur a été supprimé', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        repo.save(sample[0]);
        repo.save(sample[1]);
        await expect(service.deleteUser(1)).resolves.toBe(true);
    });

    it('deleteUser retourne false si l\'utilisateur n\'existe pas', async () => {
        repo.delete(999);
        await expect(service.deleteUser(999)).resolves.toBe(false);
    });
});