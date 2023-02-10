import { PostService } from "../services/post.service";
import { SectionService } from "../services/section.service";
import { TopicService } from "../services/topic.service";
import { UserService } from "../services/user-service";
import { IPost } from "../types/post";
import { ITopic } from "../types/topic";
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

export class PrivateRouter extends Router {

    constructor() {

        super();

        this.use(async (ctx, next) => {
            const authHeader = ctx.get('Authorization') || null;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) ctx.status = 401;
            else {
                try {
                    const data = jwt.verify(token, process.env.TOKEN_KEY);
                    ctx.data = {
                        ...data,
                        token
                    };
                    await next();
                } catch (error) {
                    ctx.status = 403;
                }
            }
        });

        this.get('/api/currentUser', async (ctx) => {
            const { id, token } = ctx.data;
            const user = await UserService.getCurrentUser(id);
            if (user) {
                ctx.body = {
                    user,
                    token
                }
                ctx.status = 200;

            } else {
                ctx.status = 404;
            }
        });

        this.post('/api/topic', async (ctx) => {
            const topic: ITopic = ctx.request.body;
            const response: any = await TopicService.insert(topic);

            if(response.result === "succeeded" && response.id >= 0) {
                ctx.body = {
                    id: response.id
                };
                ctx.status = 201;
            } else {
                ctx.body = {
                    errorMessage: response.errorMessage
                };
                ctx.status = 409;
            }
        });

        this.get('/api/topic', async (ctx) => {
            const queryParams = ctx.query || {};
            const response = await TopicService.get(queryParams);
            ctx.status = 200;
            ctx.body = {
                entry: response,
                total: response.length
            };
        });

        this.get('/api/topic/:id', async (ctx) => {
            const id = parseInt(ctx.params.id);
            const response = await TopicService.get({}, id);

            ctx.status = 200;
            ctx.body = response;
        });

        this.patch('/api/topic/:id', async (ctx) => {
            const id = parseInt(ctx.params.id);
            const response = await TopicService.patch({ id, ...ctx.request.body });

            ctx.status = 200;
            ctx.body = response;
        })

        this.post('/api/post', async (ctx) => {
            const post: IPost = ctx.request.body;
            const response: any = await PostService.insert(post);

            if(response.result === "succeeded" && response.id >= 0) {
                ctx.body = {
                    id: response.id
                };
                ctx.status = 201;
            } else {
                ctx.body = {
                    errorMessage: response.errorMessage
                };
                ctx.status = 409;
            }
        });

        this.get('/api/section', async (ctx) => {
            const response = await SectionService.get();
            ctx.status = 200;
            ctx.body = {
                entry: response,
                total: response.length
            };
        });

        this.get('/api/section/:id', async (ctx) => {
            const id = parseInt(ctx.params.id);
            const response = await SectionService.get(id);
            ctx.status = 200;
            ctx.body = response[0] || {};
        });
    }
}