import express from 'express';
import path from 'path';
import * as fs from "node:fs";
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

import { AddressController } from './adapters/driving/addressController';
import { InMemoryAddressRepo } from "./adapters/driven/inMemoryAddressRepo";
import { AddressService } from "./services/addressService";

import { UserController } from './adapters/driving/userController';
import { InMemoryUserRepo } from "./adapters/driven/inMemoryUserRepo";
import { UserService } from "./services/userService";

import gameController from './adapters/driving/gameController';

const app = express();
app.use(express.json());

const addressRepo = new InMemoryAddressRepo();
const userRepo = new InMemoryUserRepo();

const file = fs.readFileSync('./openapi.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const addressService = new AddressService(addressRepo);
const addressController = new AddressController(addressService);
addressController.registerRoutes(app);

const userService = new UserService(userRepo);
const userController = new UserController(userService);
userController.registerRoutes(app);
app.use('/games', gameController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});
