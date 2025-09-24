// middleware/middleware-chain.ts
import { Ctx } from '../types';
import { Middleware } from './middleware';
import { handler } from '../server/handle';
import { normalized } from '../utils/url-normalizer';

const middlewares: Middleware[] = [];
const pipeMiddlewares: Middleware[] = [];
const pipeMiddlewareSet = new Set<Middleware>(); // 用于快速判断是否为pipe中间件

export function use(middleware: Middleware) {
    middlewares.push(middleware);
}

export function usePipe(middleware: Middleware){
    middlewares.push(middleware);
    pipeMiddlewares.push(middleware);
    pipeMiddlewareSet.add(middleware); // 标记为pipe中间件
}

// 用 WeakMap 来跟踪每个 ctx 对象是否已经调用过 next
const nextCalledMap = new WeakMap<Ctx, boolean[]>();

export async function next(ctx: Ctx, index: number = 0) { 
    // 初始化当前 ctx 的调用状态数组（如果尚未初始化）
    if (!nextCalledMap.has(ctx)) {
        nextCalledMap.set(ctx, new Array(middlewares.length).fill(false));
    }
    
    const calledFlags = nextCalledMap.get(ctx)!;
    
    // 如果已经处理完所有中间件，执行最终处理
    if (index >= middlewares.length) { 
        const url = new URL(ctx.req.url || '/', `http://${ctx.req.headers.host}`);
        url.pathname = normalized(url.pathname);
        console.log("处理开始");
        await handler(ctx, ctx.req, ctx.res, url);
        console.log("处理结束");
        return;
    } 
    
    const currentMiddleware = middlewares[index];
    
    // 判断是否为pipe中间件
    if (pipeMiddlewareSet.has(currentMiddleware)) {
        // 是pipe中间件，直接执行不需要调用next
        try {
            await currentMiddleware(ctx, async () => {
                // pipe中间件不应该调用next，但如果调用了就忽略
            }, ctx.middlewaredData);
        } catch (error) {
            console.error(`Pipe middleware at index ${index} error:`, error);
        }
        
        // 继续执行下一个中间件
        await next(ctx, index + 1);
        return;
    }
    
    // 普通wrap中间件处理逻辑
    // 检查当前中间件的 next 是否已经被调用过
    if (calledFlags[index]) {
        throw new Error(`next() has already been called for middleware at index ${index}`);
    }
    
    // 标记当前中间件的 next 已被调用
    calledFlags[index] = true;
    
    // 调用普通中间件
    await currentMiddleware(ctx, async () => { 
        await next(ctx, index + 1);
    }, ctx.middlewaredData);
}

export { middlewares, pipeMiddlewares };