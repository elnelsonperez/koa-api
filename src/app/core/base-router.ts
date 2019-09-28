import * as Router from 'koa-joi-router';
import {Container} from "inversify";

export class BaseRouter {
    private router = Router();

    constructor(
        private container: Container,
        private controller: any,
        private prefix?: string
    ) {
        this.router.prefix(prefix)
    }

    addRoute(method: string, path: string, options: Omit<Router.Spec, 'handler' | 'method' | 'path'>, controllerMethod: string) {
        const controller:any = this.container.resolve(this.controller);

        if (!controller[controllerMethod]) {
            throw new Error(`Method '${controllerMethod}' not found in ${this.controller.name}`)
        }

        const newSpec: Router.Spec = {
            ...options,
            method,
            path,
            handler: controller[controllerMethod].bind(controller)
        };
        this.router.route(newSpec)
    }

    middleware() {
        return this.router.middleware();
    }

}
