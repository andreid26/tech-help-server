import { UserService } from "../services/user-service";
import { IUser } from "../types/user";

const Router = require('koa-router');

export class PublicRouter extends Router {

    constructor() {
        
        super();

        this.post('/auth/register', async (ctx) => {
            const user: IUser = ctx.request.body;
            const response = await UserService.insert(user);
            
            if(response.result === "succeeded" && response.id >= 0) {
                ctx.set('Location', response.id);
                ctx.status = 201;
            } else {
                ctx.body = {
                    errorMessage: response.errorMessage
                };
                ctx.status = 409;
            }
        });

        this.post('/auth/login', async (ctx) => {
            const user:IUser = ctx.request.body;
            const response = await UserService.get(user);
            ctx.body = response;
            if(response.errorMessage) { 
                ctx.status = 401;
            } else {
                ctx.status = 200;
            }
        });

    }
}