import { Express, Request, Response } from 'express';
import { Game } from "../../domain/game";
import { GamePort } from '../../ports/driving/gamePort';
import { BadRequestError } from '../../domain/error/badRequestError';
import { NotFoundError } from '../../domain/error/notFoundError';

export class GameController {

  private service: GamePort;
  private URL_PREFIX = '/games';

  constructor(private readonly gameService: GamePort) {
    this.service = gameService;
  }

  registerRoutes(app: Express) {
    app.get(this.URL_PREFIX, this.getAllGames.bind(this));
    app.post(this.URL_PREFIX, this.createGame.bind(this));
    app.delete(`${this.URL_PREFIX}/:id`, this.deleteGame.bind(this));
    app.put(`${this.URL_PREFIX}/:id`, this.updateGame.bind(this));
  }

  async getAllGames(req: Request, res: Response) {
    const games = await this.service.listGames();
    res.status(200).json(games);
  }

  async createGame(req: Request, res: Response, next: Function) {
    const { pegi, name, type, indie, multiplayer, competitive } = req.body;
    if (!pegi || !name || !type || competitive === undefined || multiplayer === undefined || indie === undefined) {
      return next(new BadRequestError('pegi, name, type, indie, multiplayer, and competitive required'));
    }

    const created = await this.service.createGame(new Game(pegi, name, type, indie, multiplayer, competitive));
    res.status(201).json(created);
  }

  async updateGame(req: Request, res: Response, next: Function) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(new BadRequestError('Game ID must be a number'));

    const { pegi, name, type, indie, multiplayer, competitive } = req.body;
    if (!pegi || !name || !type || competitive === undefined || multiplayer === undefined || indie === undefined) {
      return next(new BadRequestError('pegi, name, type, indie, multiplayer, and competitive required'));
    }

    const updated = await this.service.updateGame(id, new Game(pegi, name, type, indie, multiplayer, competitive, id));
    if (!updated) return next(new NotFoundError('Game not found'));
    res.status(200).json(updated);
  }

  async deleteGame(req: Request, res: Response, next: Function) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next(new BadRequestError('Game ID must be a number'));

    const deleted = await this.service.deleteGame(id);
    if (!deleted) return next(new NotFoundError('Game not found'));

    res.status(204).send();
  }
}