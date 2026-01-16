CREATE TABLE IF NOT EXISTS games (
    id INTEGER generated always as identity PRIMARY KEY,
    pegi INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    indie BOOLEAN NOT NULL,
    multiplayer BOOLEAN NOT NULL,
    competitive BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER generated always as identity PRIMARY KEY,
    age INTEGER NOT NULL,
    sex VARCHAR(10) NOT NULL,
    job VARCHAR(255) NOT NULL,
    political_opinion VARCHAR(255) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    favorite_games TEXT NOT NULL
);