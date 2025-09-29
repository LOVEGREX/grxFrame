// middleware/middleware-chain.ts
import { Ctx } from '../types';
import { WrapMiddleware,PipeMiddleware} from './middleware';
import { handler } from '../server/handle';
import { normalized } from '../utils/url-normalizer';

const wrapMiddlewares: WrapMiddleware[] = [];
const pipeMiddlewares: PipeMiddleware[] = [];

export function use(middleware: WrapMiddleware) {
    wrapMiddlewares.push(middleware);
}

export function usePipe(middleware: PipeMiddleware){
    pipeMiddlewares.push(middleware);
}

export async function handleRequast(ctx: Ctx) { 
    // 为每个请求创建独立的状态
    await executeWrapMiddlewares(ctx, 0);
}

async function executeWrapMiddlewares(ctx: Ctx, index: number): Promise<void> {
    // 如果已经处理完所有中间件，执行最终处理
    if (index >= wrapMiddlewares.length) { 
        const url = new URL(ctx.req.url || '/', `http://${ctx.req.headers.host}`);
        url.pathname = normalized(url.pathname);
        await executePipeMiddlewares(ctx);
        await handler(ctx, url);
        return;
    } 
    
    const currentMiddleware = wrapMiddlewares[index];
    
    // 调用wrap中间件
    //只能使用一次
    let nextCalled = false;
    const next = async () => {
        if (nextCalled) {
            throw new Error('next() called multiple times');
        }
        nextCalled = true;
        await executeWrapMiddlewares(ctx, index + 1);
    };
    await currentMiddleware(ctx, next);
}

async function executePipeMiddlewares(ctx: Ctx) { 
    if(pipeMiddlewares.length == 0){
        return;
    }
    // 顺序执行所有 pipe 中间件
    for (const pipeMiddleware of pipeMiddlewares) {
        await pipeMiddleware(ctx);
    }
}

export { wrapMiddlewares as middlewares, pipeMiddlewares };