import {Container} from "inversify";
import databaseConnection from "@src/database/database.connection";
import {Connection} from "typeorm";
import {buildProviderModule} from "inversify-binding-decorators";

export default async function createContainer() {
    const DIContainer = new Container();
    const connection = await databaseConnection;
    DIContainer.bind<Connection>(Connection).toConstantValue(connection);
    DIContainer.load(buildProviderModule());
    return DIContainer;
}
