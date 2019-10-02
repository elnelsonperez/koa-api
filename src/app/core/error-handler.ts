import { Context } from 'koa';
import {BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR} from "http-status-codes";

export default  (error: any, ctx: Context) => {
    if (error.httpCode === UNAUTHORIZED || error.status === UNAUTHORIZED) {
        ctx.status = UNAUTHORIZED;
        ctx.body = {
            status: UNAUTHORIZED,
            message: error.message
        };
        ctx.set("X-Status-Reason", error.message)
    } else if (error.httpCode === BAD_REQUEST || error.status === BAD_REQUEST) {
        ctx.body = {
            message: 'Validation Error',
            data: error.errors,
            status: BAD_REQUEST
        };
        ctx.status = BAD_REQUEST;
    } else {
        const status = error.statusCode || error.status || INTERNAL_SERVER_ERROR;
        ctx.body = {
            message: 'Unexpected Error',
            data: error,
            status: status
        };
    }

};
