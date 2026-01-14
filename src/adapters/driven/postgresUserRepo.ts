import { User } from '../../domain/user';
import { UserRepositoryPort } from '../../ports/driven/repoPort';
import { pool } from '../../config/db';

export class PostgresUserRepo implements UserRepositoryPort {
  async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return result.rows.map(row => new User(
      row.age,
      row.sex,
      row.job,
      row.political_opinion,
      row.nationality,
      row.favorite_games ? row.favorite_games.split(',') : [],
      row.id
    ));
  }



  async save(user: Omit<User, 'id'>): Promise<User> {
    let favoriteGamesString = user.favoriteGames.join(',');
    const result = await pool.query(
      'INSERT INTO users (age, sex, job, political_opinion, nationality, favorite_games) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.age, user.sex, user.job, user.politicalOpinion, user.nationality, favoriteGamesString]
    );
    const row = result.rows[0];
    return new User(row.age, row.sex, row.job, row.political_opinion, row.nationality, row.favorite_games ? row.favorite_games.split(',') : [], row.id);
  }

  async update(id: number, user: Omit<User, 'id'>): Promise<User | null> {
    const result = await pool.query(
      'UPDATE users SET age = $1, sex = $2, job = $3, political_opinion = $4, nationality = $5, favorite_games = $6 WHERE id = $7 RETURNING *',
      [user.age, user.sex, user.job, user.politicalOpinion, user.nationality, user.favoriteGames.join(','), id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.age, row.sex, row.job, row.political_opinion, row.nationality, row.favorite_games ? row.favorite_games.split(',') : [], row.id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}