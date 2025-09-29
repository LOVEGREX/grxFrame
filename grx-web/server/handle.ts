// server/handle.ts
import { Ctx } from '../types';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getRouteHandler } from '../router/router-resgistry';
export async function handler(ctx: Ctx, url: URL) {
    if (ctx.req.method) {
        //处理开始
        console.log("处理开始");
        const handler = getRouteHandler(ctx.req.method, url.pathname);
        if (!handler) {
            ctx.res.statusCode = 404;
            ctx.res.end('Not Found');
            return;
        }
        try {
            await handler(ctx);
            //处理结束
            console.log("处理结束");
        } catch (error) { 
            ctx.res.statusCode = 500;
            ctx.res.end('Internal Server Error');
            console.log(error);
        }
    }
}