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

        const gameTypes = games.filter(game => game.type === input).map(game => game.name);
        const politicalOpinions = users.filter(user => user.favoriteGames.some(favGame => gameTypes.includes(favGame))).map(user => user.politicalOpinion);

        const uniqueOpinions = Array.from(new Set(politicalOpinions));
        const opinionCounts = new Map<string, number>();
        politicalOpinions.forEach(opinion => {
            opinionCounts.set(opinion, (opinionCounts.get(opinion) ?? 0) + 1);
        });
        uniqueOpinions.sort((a, b) => (opinionCounts.get(b) ?? 0) - (opinionCounts.get(a) ?? 0));
        uniqueOpinions.reverse();
        uniqueOpinions.splice(3);

        return uniqueOpinions;
    }
}
