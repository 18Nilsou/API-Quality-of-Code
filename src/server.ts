import express, { Request, Response } from 'express';
import path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

import { AddressController } from './adapters/driving/addressController';
import { InMemoryAddressRepo } from "./adapters/driven/inMemoryAddressRepo";
import { AddressService } from "./services/addressService";

import { UserController } from './adapters/driving/userController';
//import { InMemoryUserRepo } from "./adapters/driven/inMemoryUserRepo";
import { PostgresUserRepo } from "./adapters/driven/postgresUserRepo";
import { UserService } from "./services/userService";

import { GameController } from './adapters/driving/gameController';
//import { InMemoryGameRepo } from "./adapters/driven/inMemoryGameRepo";
import { PostgresGameRepo } from "./adapters/driven/postgresGameRepo";
import { GameService } from "./services/gameService";

import { HttpError } from './domain/error/httpError';

import { AggregateService } from './services/aggregateService';
import { AggregateController } from './adapters/driving/aggregateController';
import { pool } from './config/db';

const app = express();
app.use(express.json());

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    const sql = fs.readFileSync(path.join(__dirname, 'migration/init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

const addressRepo = new InMemoryAddressRepo();
//const userRepo = new InMemoryUserRepo();
//const gameRepo = new InMemoryGameRepo();

const userRepo = new PostgresUserRepo(pool);
const gameRepo = new PostgresGameRepo(pool);

const file = fs.readFileSync('./openapi.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const addressService = new AddressService(addressRepo);
const addressController = new AddressController(addressService);
addressController.registerRoutes(app);

const userService = new UserService(userRepo);
const userController = new UserController(userService);
userController.registerRoutes(app);

const gameService = new GameService(gameRepo);
const gameController = new GameController(gameService);
gameController.registerRoutes(app);

const aggregateService = new AggregateService(userRepo, gameRepo);
const aggregateController = new AggregateController(aggregateService);
aggregateController.registerRoutes(app);

app.use((err: HttpError, req: Request, res: Response, next: Function) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;

// Start server after running migrations
async function startServer() {
  try {
    await runMigrations();
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
      console.log(`Swagger docs at http://localhost:${port}/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
