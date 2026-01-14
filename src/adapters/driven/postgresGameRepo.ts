import { Game } from '../../domain/game';
import { GameRepositoryPort } from '../../ports/driven/repoPort';
import type { Pool } from 'pg';

export class PostgresGameRepo implements GameRepositoryPort {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<Game[]> {
    const result = await this.pool.query('SELECT * FROM games ORDER BY id');
    return result.rows.map(row => new Game(
      row.pegi,
      row.name,
      row.type,
      row.indie,
      row.multiplayer,
      row.competitive,
      row.id
    ));
  }

  async save(game: Omit<Game, 'id'>): Promise<Game> {
    const result = await this.pool.query(
      'INSERT INTO games (pegi, name, type, indie, multiplayer, competitive) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [game.pegi, game.name, game.type, game.indie, game.multiplayer, game.competitive]
    );
    const row = result.rows[0];
    return new Game(row.pegi, row.name, row.type, row.indie, row.multiplayer, row.competitive, row.id);
  }

  async update(id: number, game: Omit<Game, 'id'>): Promise<Game | null> {
    const result = await this.pool.query(
      'UPDATE games SET pegi = $1, name = $2, type = $3, indie = $4, multiplayer = $5, competitive = $6 WHERE id = $7 RETURNING *',
      [game.pegi, game.name, game.type, game.indie, game.multiplayer, game.competitive, id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Game(row.pegi, row.name, row.type, row.indie, row.multiplayer, row.competitive, row.id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM games WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}