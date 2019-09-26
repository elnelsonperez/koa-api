import app from '@app/app';
import { areWeTestingWithJest } from './helpers';

// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT:number = Number(process.env.PORT) || 3000;

const server = app.listen(PORT);

if (!areWeTestingWithJest()) {
    console.log(`App Started at http://127.0.0.1:${PORT}`);
}

export default server;
