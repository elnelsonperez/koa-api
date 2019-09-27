import {createContainer, InjectionMode, asClass, Lifetime, asValue, asFunction, AwilixContainer} from 'awilix';
import {camelCase} from 'lodash';
import databaseConnection from '@src/database/database.connection';
import UserRepository from "@src/database/repository/user.repository";
import {Connection, ObjectType} from "typeorm";

export async function configureContainer() {
    const container = createContainer({
        injectionMode: InjectionMode.PROXY,
    });

    const connection = await databaseConnection;

    container.register('db', asValue(connection));
    registerRepository(UserRepository, container);

    container.loadModules([
        [
            'src/app/api/modules/**/*.controller.ts',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED,
            },
        ]
    ],                    {
        formatName: formatCamel,
    });

    return container;
}

function registerRepository<T>(repository: ObjectType<T>, container: AwilixContainer) {
    container.register(camelCase(repository.name), asFunction(makeRepository(UserRepository)).scoped());
}

function makeRepository<T>(repository: ObjectType<T>) {
    return ({db}:{db: Connection}) => db.getCustomRepository(repository)
}

function formatCamel(name:string) {
    return camelCase(name.replace('.', ' '));
}
