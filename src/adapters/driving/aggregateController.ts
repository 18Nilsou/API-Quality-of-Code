import { Express, Request, Response } from 'express';
import { AggregatePort } from "../../ports/driving/aggregatePort";

export class AggregateController {

    private service: AggregatePort;
    private URL_PREFIX = '/data';

    constructor(private readonly aggregateService: AggregatePort) {
        this.service = aggregateService;
    }

    registerRoutes(app: Express) {
        app.get(this.URL_PREFIX, this.getAllData.bind(this));
        app.get(this.URL_PREFIX + "/game-type/:type", this.getPoliticalOpinionsPerGameType.bind(this));
    }

    async getAllData(req: Request, res: Response) {
        const data = await this.service.listData();
        res.status(200).json(data);
    }

    async getPoliticalOpinionsPerGameType(req: Request, res: Response) {
        const type = req.params.type;
        const opinions = await this.service.listPoliticalOpinionsPerGameType(type);
        res.status(200).json(opinions);
    }
}