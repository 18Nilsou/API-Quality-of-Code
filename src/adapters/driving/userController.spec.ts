import { UserController } from './userController';
import { User } from '../../domain/user';
import { NotFoundError } from '../../domain/error/notFoundError';
import { BadRequestError } from '../../domain/error/badRequestError';

describe('UserController', () => {
    let mockPort: {
        listUsers: jest.Mock<Promise<User[]>, []>;
        createUser: jest.Mock<Promise<User>, [Omit<User, 'id'>]>;
        updateUser: jest.Mock<Promise<User | null>, [number, Omit<User, 'id'>]>;
        deleteUser: jest.Mock<Promise<boolean>, [number]>;
    };
    let controller: UserController;

    beforeEach(() => {
        mockPort = {
            listUsers: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
        };
        controller = new UserController(mockPort);
    });

    it('listUsers retourne la liste des utilisateurs', async () => {
        const sample: User[] = [new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1), new User(30, 'F', 'Unemployed', 'RN', 'French', [], 2)];
        mockPort.listUsers.mockResolvedValue(sample);

        const mockReq = {} as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;

        await controller.getAllUsers(mockReq, mockRes);

        expect(mockPort.listUsers).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(sample);
    });

    it('createUser crée un utilisateur et le retourne', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', []);
        const saved = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        mockPort.createUser.mockResolvedValue(saved);

        const mockReq = {
            body: input,
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.createUser(mockReq, mockRes, mockNext);

        expect(mockPort.createUser).toHaveBeenCalledWith(input);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(saved);
    });

    it('createUser renvoie une erreur si les données sont erronées', async () => {
        const mockReq = {
            body: { age: 25, sex: 'M', politicalOpinion: 'Reconquête', nationality: 'French' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.createUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('age, sex, job, politicalOpinion, nationality and favoriteGames required'));
    });

    it('updateUser met à jour un utilisateur existant et le retourne', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', [], 1);
        const updated = new User(25, 'M', 'Unemployed', 'Reconquête', 'French', [], 1);
        mockPort.updateUser.mockResolvedValue(updated);

        const mockReq = {
            params: { id: '1' },
            body: input,
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.updateUser(mockReq, mockRes, mockNext);

        expect(mockPort.updateUser).toHaveBeenCalledWith(1, input);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(updated);
    });

    it('updateUser renvoie une erreur si les données sont erronées', async () => {
        const mockReq = {
            params: { id: '1' },
            body: { age: 25, sex: 'M', politicalOpinion: 'Reconquête', nationality: 'French' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('age, sex, job, politicalOpinion, nationality and favoriteGames required'));
    });

    it('updateUser renvoie une erreur si l\'ID est invalide', async () => {
        const mockReq = {
            params: { id: 'abc' },
            body: {},
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('User ID must be a number'));
    });

    it('updateUser renvoie une erreur si l\'utilisateur n\'existe pas', async () => {
        const input = new User(25, 'M', 'Engineer', 'Reconquête', 'French', []);
        mockPort.updateUser.mockResolvedValue(null);
        const mockReq = {
            params: { id: '999' },
            body: input,
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.updateUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });

    it('deleteUser supprime un utilisateur existant', async () => {
        mockPort.deleteUser.mockResolvedValue(true);

        const mockReq = {
            params: { id: '1' },
        } as any;
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        } as any;
        const mockNext = jest.fn();

        await controller.deleteUser(mockReq, mockRes, mockNext);

        expect(mockPort.deleteUser).toHaveBeenCalledWith(1);
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.send).toHaveBeenCalled();
    });

    it('deleteUser renvoie une erreur si l\'ID est invalide', async () => {
        const mockReq = {
            params: { id: 'abc' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.deleteUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('User ID must be a number'));
    });

    it('deleteUser renvoie une erreur si l\'utilisateur n\'existe pas', async () => {
        mockPort.deleteUser.mockResolvedValue(false);
        const mockReq = {
            params: { id: '999' },
        } as any;
        const mockRes = {} as any;
        const mockNext = jest.fn();

        await controller.deleteUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });
});