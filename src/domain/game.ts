export class Game {
    id?: number;
    pegi: number;
    name: string;
    type: string;
    indie: boolean;
    multiplayer: boolean;
    competitive: boolean;

    constructor(pegi: number, name: string, type: string, indie: boolean, multiplayer: boolean, competitive: boolean, id?: number) {
        this.id = id;
        this.pegi = pegi;
        this.name = name;
        this.type = type;
        this.indie = indie;
        this.multiplayer = multiplayer;
        this.competitive = competitive;
    }
}
