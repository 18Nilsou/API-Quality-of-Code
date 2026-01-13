import { Express, Request, Response } from 'express';
import { User } from "../../domain/user";
import { UserPort } from '../../ports/driving/userPort';
import { NotFoundError } from '../../domain/error/notFoundError';
import { BadRequestError } from '../../domain/error/badRequestError';

export class UserController {

    private service: UserPort;
    private URL_PREFIX = '/users';
    private requiredFields = ['age', 'sex', 'job', 'politicalOpinion', 'nationality'];

    constructor(private readonly userService: UserPort) {
        this.service = userService;
    }

    registerRoutes(app: Express) {
        app.get(this.URL_PREFIX, this.getAllUsers.bind(this));
        app.post(this.URL_PREFIX, this.createUser.bind(this));
        app.delete(`${this.URL_PREFIX}/:id`, this.deleteUser.bind(this));
        app.put(`${this.URL_PREFIX}/:id`, this.updateUser.bind(this));
    }

    async getAllUsers(req: Request, res: Response) {
        const list = await this.service.listUsers();
        res.status(200).json(list);
    }

    async createUser(req: Request, res: Response, next: Function) {
        if (!this.checkRequiredFields(req.body)) {
            return next(new BadRequestError('age, sex, job, politicalOpinion and nationality required'));
        }

        const { age, sex, job, politicalOpinion, nationality } = req.body;

        const created = await this.service.createUser(new User(age, sex, job, politicalOpinion, nationality));
        res.status(201).json(created);
    }

    async updateUser(req: Request, res: Response, next: Function) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return next(new BadRequestError('User ID must be a number'));

        if (!this.checkRequiredFields(req.body)) {
            return next(new BadRequestError('age, sex, job, politicalOpinion and nationality required'));
        }

        const { age, sex, job, politicalOpinion, nationality } = req.body;

        const updated = await this.service.updateUser(id, new User(age, sex, job, politicalOpinion, nationality));
        if (!updated) return next(new NotFoundError('User not found'));
        res.status(200).json(updated);
    }

    async deleteUser(req: Request, res: Response, next: Function) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return next(new BadRequestError('User ID must be a number'));

        const deleted = await this.service.deleteUser(id);
        if (!deleted) return next(new NotFoundError('User not found'));

        res.status(204).send();
    }

    private checkRequiredFields(body: any): boolean {
        for (const field of this.requiredFields) {
            if (!(field in body)) {
                return false;
            }
        }
        return true;
    }
}
