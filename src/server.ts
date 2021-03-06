import 'reflect-metadata';
import CreateApplication from '@app/app';
import { isTesting } from './helpers';

import * as dotenv from 'dotenv'
dotenv.config();

const PORT:number = Number(process.env.PORT) || 3000;

CreateApplication().then(async (app) => {

    const server = app.listen(PORT);

    process.once('SIGTERM', function (code) {
        console.log('Shutting down server!');
        server.close();
    });

    if (!isTesting()) {
        console.log(`App Started at http://127.0.0.1:${PORT}`);
    }

});
