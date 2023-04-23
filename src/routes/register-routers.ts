import express, { Handler, IRouter } from "express";
import { MetadataKeys } from "../decorators/metadata-keys";
import { listControllers } from "./map-controllers";

type methodsRoute = 'get' | 'post' | 'put' | 'delete' | 'patch'

class RegisterRouters {
    serverRouters: express.Application
    debugMode: boolean
    constructor(server: express.Application, debugMode: boolean) {
        this.serverRouters = server;
        this.debugMode = debugMode;
    }

    public async startRegister(prefix: string) {
        const info: Array<{ api: string, handler: string, middlewares: string, middlewaresIn: string }> = [];
        const controllers = await listControllers()
        controllers?.forEach((controllerClass: any) => {
            if (!controllerClass) {return;}

            const reflectClass = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass)
            if (!reflectClass) {return;}

            const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;

            const { basePath, controllerOptions } = reflectClass;
            const fullBasePath = prefix + basePath
            const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);

            const exRouter = express.Router();

            routers.forEach(({ method, path, options, handlerName }: any) => {
                let middleware = options?.middlewares.length ? options.middlewares : []
                middleware = !middleware?.length && controllerOptions?.middlewares?.length ? controllerOptions.middlewares : middleware
                exRouter[method as methodsRoute](path, middleware, controllerInstance[String(handlerName)].bind(controllerInstance));

                this.debugMode && info.push({
                    api: `${method.toLocaleUpperCase()} ${fullBasePath + path}`,
                    handler: `${controllerClass.name}.${String(handlerName)}`,
                    middlewares: middleware.length ? `${middleware.map((item: () => void) => { return item.name })}` : 'NO',
                    middlewaresIn: `${this.getMiddwareLocation(options?.middlewares, controllerOptions?.middlewares)}`,
                });

            });

            this.serverRouters.use(fullBasePath, exRouter);
        });

        this.debugMode && console.table(info);
        return this.serverRouters;
    }


    private getMiddwareLocation(routes: any[], controller: any[]) {
        if (routes?.length) {
            return 'Method'
        }
        if (controller?.length) {
            return 'Controller'
        }

        return 'NO'
    }
}

export default RegisterRouters