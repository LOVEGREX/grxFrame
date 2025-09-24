// middleware/middleware-chain.ts
import { Ctx } from '../types';
import { Middleware } from './middleware';
import { handler } from '../server/handle';
import { normalized } from '../utils/url-normalizer';

const middlewares: Middleware[] = [];

export function use(middleware: Middleware) {
    middlewares.push(middleware);
}

export async function next(ctx: Ctx, index: number = 0) { 
    if (index >= middlewares.length) { 
        const url = new URL(ctx.req.url || '/', `http://${ctx.req.headers.host}`);
        url.pathname = normalized(url.pathname);
        console.log("处理开始");
        await handler(ctx, ctx.req, ctx.res, url);
        console.log("处理结束");
        return;
    } 
    await middlewares[index](ctx, async () => { 
        await next(ctx, index + 1);
    }, ctx.middlewaredData);
}

export { middlewares };