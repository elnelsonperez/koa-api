import app from '@app/app';
import { areWeTestingWithJest } from './helpers';
import databaseConnection from './database/database.connection';
import usersSeeder from '@src/database/seeders/users.seeder';

const PORT:number = Number(process.env.PORT) || 3000;

databaseConnection
    .then(async (connection) => {
        await usersSeeder();
        app.context.db = connection;
        app.listen(PORT);
        if (!areWeTestingWithJest()) {
            console.log(`App Started at http://127.0.0.1:${PORT}`);
        }
    })
    .catch(console.error);
