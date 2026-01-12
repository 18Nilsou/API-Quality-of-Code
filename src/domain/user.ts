export class User {
    id?: number;
    age: number;
    sex: string;
    job: string;
    politicalOpinion: string;
    nationality: string;

    constructor(age: number, sex: string, job: string, politicalOpinion: string, nationality: string, id?: number) {
        this.id = id;
        this.age = age;
        this.sex = sex;
        this.job = job;
        this.politicalOpinion = politicalOpinion;
        this.nationality = nationality;
    }
}
