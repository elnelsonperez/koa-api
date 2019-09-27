import CreateApplication from '@app/app';
import { areWeTestingWithJest } from './helpers';
import usersSeeder from '@src/database/seeders/users.seeder';

const PORT:number = Number(process.env.PORT) || 3000;

CreateApplication().then(async (app) => {
    await usersSeeder();
    app.listen(PORT);
    if (!areWeTestingWithJest()) {
        console.log(`App Started at http://127.0.0.1:${PORT}`);
    }
});
