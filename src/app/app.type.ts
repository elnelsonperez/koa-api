import { Context } from 'koa';
import { Connection } from 'typeorm';

export interface DbContext extends Context {
    db?: Connection;
}
