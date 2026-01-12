import express from 'express';
import { InMemoryGameRepo } from '../driven/inMemoryGameRepo';
import { GameService } from '../../services/gameService';
import { Game } from "../../domain/game";

const router = express.Router();

const repo = new InMemoryGameRepo();
const service = new GameService(repo);


router.get('/', async (req, res) => {
  const list = await service.listGames();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { pegi, name, type, indie, multiplayer, competitive } = req.body;
  if (pegi === undefined || name === undefined || type === undefined || competitive === undefined || multiplayer === undefined || indie === undefined) {
    return res.status(400).json({ message: 'name, type, indie, multiplayer, competitive, and pegi required' });
  }
  const created = await service.createGame(new Game(pegi, name, type, indie, multiplayer, competitive));
  res.status(201).json(created);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  await service.deleteGame(id);
  res.status(204).send();
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { pegi, name, type, indie, multiplayer, competitive } = req.body;
  if (isNaN(id) || pegi === undefined || name === undefined || type === undefined || competitive === undefined || multiplayer === undefined || indie === undefined) {
    return res.status(400).json({ message: 'name, type, indie, multiplayer, competitive, and pegi required'  });
  }
  const updated = await service.updateGame(new Game(pegi, name, type, indie, multiplayer, competitive, id));
  res.json(updated);
});

export default router;
