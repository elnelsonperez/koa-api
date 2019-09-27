import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
    type: 'sqljs',
    entities: [
        `${parentDir}/**/*.entity.ts`,
    ],
    synchronize: true,
};

const databaseConnection:Promise<Connection> = createConnection(connectionOpts);

export default databaseConnection;
