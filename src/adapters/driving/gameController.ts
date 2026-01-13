import express, { Express } from 'express';
import { InMemoryGameRepo } from '../driven/inMemoryGameRepo';
import { GameService } from '../../services/gameService';
import { Game } from "../../domain/game";
import { GameRepositoryPort } from "../../ports/driven/repoPort";
import { GamePort } from "../../ports/driving/gamePort";
import {Request, Response} from "express";

export class GameController {
  
  private service: GameService;
  private URL_PREFIX = '/games';
  
  constructor(service: GameService) {
    this.service = service;
  }

  registerRoutes(app: Express) {
    app.get(this.URL_PREFIX, this.getAllGames.bind(this));
    app.post(this.URL_PREFIX, this.createGame.bind(this));
    app.delete(`${this.URL_PREFIX}/:id`, this.deleteGame.bind(this));
    app.put(`${this.URL_PREFIX}/:id`, this.updateGame.bind(this));
  }

  async getAllGames(req: Request, res: Response): Promise<void> {
    const games = await this.service.listGames();
    res.json(games);
  }

  async createGame(req: Request, res: Response): Promise<void> {
    const { pegi, name, type, indie, multiplayer, competitive } = req.body;
    if (pegi === undefined || name === undefined || type === undefined || competitive === undefined || multiplayer === undefined || indie === undefined) {
      res.status(400).json({ message: 'name, type, indie, multiplayer, competitive, and pegi required' });
      return;
    }
    const created = await this.service.createGame(new Game(pegi, name, type, indie, multiplayer, competitive));
    res.status(201).json(created);
  }

  async deleteGame(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }
    await this.service.deleteGame(id);
    res.status(204).send();
  }

  async updateGame(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const { pegi, name, type, indie, multiplayer, competitive } = req.body;
    if (isNaN(id) || pegi === undefined || name === undefined || type === undefined || competitive === undefined || multiplayer === undefined || indie === undefined) {
      res.status(400).json({ message: 'name, type, indie, multiplayer, competitive, and pegi required'  });
      return;
    }
    const updated = await this.service.updateGame(new Game(pegi, name, type, indie, multiplayer, competitive, id));
    res.json(updated);
  }
}