// middleware/middleware-chain.ts
import { Ctx } from '../types';
import { wrapMiddleware,pipeMiddleware} from './middleware';
import { handler } from '../server/handle';
import { normalized } from '../utils/url-normalizer';

const wrapMiddlewares: wrapMiddleware[] = [];
const pipeMiddlewares: pipeMiddleware[] = [];
let nextIndex = 0;

export function use(middleware: wrapMiddleware) {
    wrapMiddlewares.push(middleware);
    nextIndex = 1;
}

export function usePipe(middleware: pipeMiddleware){
    pipeMiddlewares.push(middleware);
    nextIndex = 1;
}

export async function next(ctx: Ctx, index: number = 0) {  
    if(nextIndex == 0){
        console.error('next() called multiple times');
        return;
    }
    // 如果已经处理完所有中间件，执行最终处理
    if (index >= wrapMiddlewares.length) { 
        const url = new URL(ctx.req.url || '/', `http://${ctx.req.headers.host}`);
        url.pathname = normalized(url.pathname);
        await next_pipe(ctx);
        console.log("处理开始");
        await handler(ctx, url);
        console.log("处理结束");
        nextIndex = 0;
        return;
    } 
    
    const currentMiddleware = wrapMiddlewares[index];
    
    // 调用wrap中间件
    await currentMiddleware(ctx, async () => { 
        await next(ctx, index + 1);
    }, ctx.middlewaredData);
}
export async function next_pipe(ctx: Ctx) { 
    if(pipeMiddlewares.length == 0){
        return;
    }
    // 顺序执行所有 pipe 中间件
    for (const pipeMiddleware of pipeMiddlewares) {
        await pipeMiddleware(ctx);
    }
}

export { wrapMiddlewares as middlewares, pipeMiddlewares };