// server/http-server.ts
import { createServer, IncomingMessage, ServerResponse } from "http";
import { handleRequast } from '../middleware/middleware-chain';
import { Ctx } from '../types';

export const server = createServer(async (req, res) => {
    const originEnd = res.end.bind(res);
    const originWrite = res.write.bind(res);
    // 防重复 end 调用
    let endCalled = false;

    // 重写 write：直接透传
    res.write = function (this: ServerResponse, chunk: any, encoding?: any, cb?: (() => void)) {
        return originWrite(chunk, encoding as any, cb as any) as any;
    } as any;

    // 重写 end 方法
    res.end = function (this: ServerResponse, chunk?: any, encoding?: any, cb?: (() => void)) { 
        if (endCalled) return this as any;
        endCalled = true;
        return originEnd(chunk as any, encoding as any, cb as any) as any;
    } as any;


    const ctx: Ctx = { 
        req, 
        res,
        // 返回json数据
        json: (input: object) => { 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(input));
        },
        // 中间件数据
        middlewaredData: new Map<string, any>(),
        getMiddlewareData(key: string){ 
            return ctx.middlewaredData.get(key);
        },
        setMiddlewareData(key: string, value: any){ 
            ctx.middlewaredData.set(key, value);
        }
    };
    
    try { 
        await handleRequast(ctx);
        // if (!endCalled) {
        //     res.end();
        // }
    } catch (error) { 
        res.statusCode = 500;
        ctx.res.end('<h1>Helsdasdsadslo World!</h1>');
        originEnd('Internal Server Error');
        console.log(error);
    }
});