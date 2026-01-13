import { Express } from 'express';
import { User } from "../../domain/user";
import { UserPort } from '../../ports/driving/userPort';
import { Request, Response } from "express";

export class UserController {
    private service: UserPort;

    constructor(private readonly userService: UserPort) {
        this.service = userService;
    }

    registerRoutes(app: Express) {
        app.get('/users', this.getAllUsers.bind(this));
        app.post('/users', this.createUser.bind(this));
        app.put('/users/:id', this.updateUser.bind(this));
        app.delete('/users/:id', this.deleteUser.bind(this));
    }

    async getAllUsers(req: Request, res: Response) {
        const list = await this.service.listUsers();
        res.json(list);
    }

    async createUser(req: Request, res: Response) {
        const { age, sex, job, politicalOpinion, nationality } = req.body;
        if (!age || !sex || !job || !politicalOpinion || !nationality) {
            return res.status(400).json({ message: 'age, sex, job, politicalOpinion and nationality required' });
        }
        const created = await this.service.createUser(new User(age, sex, job, politicalOpinion, nationality));
        res.status(201).json(created);
    }

    async updateUser(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { age, sex, job, politicalOpinion, nationality } = req.body;
        if (!age || !sex || !job || !politicalOpinion || !nationality) {
            return res.status(400).json({ message: 'age, sex, job, politicalOpinion and nationality required' });
        }
        const updated = await this.service.updateUser(id, new User(age, sex, job, politicalOpinion, nationality));
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    }

    async deleteUser(req: Request, res: Response) {
        const id = Number(req.params.id);
        const deleted = await this.service.deleteUser(id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(204).send();
    }
}
