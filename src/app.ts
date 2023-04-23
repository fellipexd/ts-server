import express, { Application } from "express";
import RegisterRouters from "./routes/register-routers";

export default class App extends RegisterRouters {
    public server: Application;

    constructor(server: Application, debugMode: boolean) {
        super(express(), debugMode)
        this.server = server;
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
    }

    private async router() {
        const routes = await this.startRegister('')
        this.server.use(routes);
    }

}