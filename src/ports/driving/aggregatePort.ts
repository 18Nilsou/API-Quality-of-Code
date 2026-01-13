import { Data } from '../../domain/data';

export interface AggregatePort {
    listData(): Promise<Data>;
    listPoliticalOpinionsPerGameType(input: string): Promise<string[]>;
}