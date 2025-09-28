// server/handle.ts
import { Ctx } from '../types';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getRouteHandler } from '../router/router-resgistry';

//handle无法重复使用
const requestHandledMap = new WeakMap<Ctx, boolean>();
export async function handler(ctx: Ctx, url: URL) {
    if (requestHandledMap.get(ctx)) {
        return;
    }

    requestHandledMap.set(ctx, true);
    
    if (ctx.req.method) {
        const handler = getRouteHandler(ctx.req.method, url.pathname);
        if (!handler) {
            ctx.res.statusCode = 404;
            ctx.res.end('Not Found');
            return;
        }
        try {
            await handler(ctx);
        } catch (error) { 
            ctx.res.statusCode = 500;
            ctx.res.end('Internal Server Error');
            console.log(error);
        }
    }
}