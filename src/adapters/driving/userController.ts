import express from 'express';
import { InMemoryUserRepo } from '../driven/inMemoryUserRepo';
import { UserService } from '../../services/userService';
import { User } from "../../domain/user";

const router = express.Router();

const repo = new InMemoryUserRepo();
const service = new UserService(repo);

router.get('/', async (req, res) => {
    const list = await service.listUsers();
    res.json(list);
});

router.post('/', async (req, res) => {
    const { age, sex, job, politicalOpinion, nationality } = req.body;
    if (!age || !sex || !job || !politicalOpinion || !nationality) {
        return res.status(400).json({ message: 'age, sex, job, politicalOpinion and nationality required' });
    }
    const created = await service.createUser(new User(age, sex, job, politicalOpinion, nationality));
    res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const found = await service.getUser(id);
    if (!found) return res.status(404).json({ message: 'User not found' });
    res.json(found);
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { age, sex, job, politicalOpinion, nationality } = req.body;
    if (!age || !sex || !job || !politicalOpinion || !nationality) {
        return res.status(400).json({ message: 'age, sex, job, politicalOpinion and nationality required' });
    }
    const updated = await service.updateUser(id, new User(age, sex, job, politicalOpinion, nationality));
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await service.deleteUser(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
});

export default router;
