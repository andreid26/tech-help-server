import * as Koa from "koa";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyparser from "koa-bodyparser";
import { config, dbConfig } from "./config/server-config";
import { PublicRouter } from "./routes/public-routes";
import { IServerConfiguration } from "./types/server";
import { DatabaseConfiguration } from "./config/database-config";
import { PrivateRouter } from "./routes/private-routes";

class RestaurantAdvisorServer {

    private config: IServerConfiguration;

    constructor(config: IServerConfiguration) {
        this.config = config;
    }
 
    async init() {
        const app = new Koa();

        // Middlewares
        app.use(json());
        app.use(bodyparser());
        app.use(logger());

        // Database connect
        await DatabaseConfiguration.connect(dbConfig);

        // Headers

        app.use(async (ctx, next) => {
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH');
            await next();
        });

        // Routes
        const publicRouter = new PublicRouter();
        app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

        const privateRouter = new PrivateRouter();
        app.use(privateRouter.routes()).use(privateRouter.allowedMethods());

        app.listen(config.port, () => {
            console.log(`Koa server running at http://${config.host}:${config.port}`);
        });

    }
}

const server = new RestaurantAdvisorServer(config);
server.init();