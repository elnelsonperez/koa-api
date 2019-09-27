import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import {User} from "@src/database/entity/user.entity";

const connectionOpts: ConnectionOptions = {
    type: 'sqlite',
    database: ':memory:',
    entities: [
        User
    ],
    synchronize: true,
};

const databaseConnection: Promise<Connection> = createConnection(connectionOpts);

export default databaseConnection;
