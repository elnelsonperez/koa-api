import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import {User} from "@src/database/entity/user.entity";
import {isTesting} from "@src/helpers";

const connectionOpts: ConnectionOptions = {
    type: 'sqlite',
    database: isTesting() ? ':memory:' : 'db',
    entities: [
        User
    ],
    synchronize: true,
};

const databaseConnection: Promise<Connection> = createConnection(connectionOpts);

export default databaseConnection;
