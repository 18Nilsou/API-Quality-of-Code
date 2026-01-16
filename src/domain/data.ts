import { Game } from "./game";
import { User } from "./user";

export class Data {
    games: Game[];
    users: User[];

    constructor(games: Game[], users: User[]) {
        this.games = games;
        this.users = users;
    }
}