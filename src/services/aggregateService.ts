import { Data } from "../domain/data";
import { GameRepositoryPort, UserRepositoryPort } from "../ports/driven/repoPort";
import { AggregatePort } from "../ports/driving/aggregatePort";

export class AggregateService implements AggregatePort {

    constructor(private userRepo: UserRepositoryPort, private gameRepo: GameRepositoryPort) { }

    async listData(): Promise<Data> {
        const users = await this.userRepo.findAll();
        const games = await this.gameRepo.findAll();

        return new Data(games, users);
    }

    async listPoliticalOpinionsPerGameType(input: string): Promise<string[]> {
        const users = await this.userRepo.findAll();
        const games = await this.gameRepo.findAll();

        const gameNames = new Set(
            games
                .filter(game => game.type === input)
                .map(game => game.name)
        );

        const opinionCounts = new Map<string, number>();

        users
            .filter(user => user.favoriteGames.some(fav => gameNames.has(fav)))
            .forEach(user => {
                const opinion = user.politicalOpinion;
                opinionCounts.set(opinion, (opinionCounts.get(opinion) ?? 0) + 1);
            });

        return Array.from(opinionCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([opinion]) => opinion);
    }
}
