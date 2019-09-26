import databaseConnection from '../database.connection';
import {random, name} from 'faker';
import {User} from '@src/database/entity/user.entity';

const fakeUser = () => {
    return {name: name.firstName(), password: random.alphaNumeric(10)};
};
const users = [
    {name: 'John', password: random.alphaNumeric(10)},
    {...fakeUser()},
    {...fakeUser()},
    {...fakeUser()},
    {...fakeUser()},
];

const usersSeeder = async () => {
    const connection = await databaseConnection;
    await connection.manager.save(User, users);
    console.log('Users seeded');
};

export {usersSeeder};
export  default usersSeeder;
