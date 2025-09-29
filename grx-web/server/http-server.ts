// server/http-server.ts
import { createServer, IncomingMessage, ServerResponse } from "http";
import { handleRequast } from '../middleware/middleware-chain';
import { Ctx } from '../types';

export const server = createServer(async (req, res) => {
    const originEnd = res.end.bind(res);
    // 缓存写入的数据，直到统一 flush
    let bufferedChunks: Buffer[] = [];
    // 是否已经结束
    let isEnded = false;
    // 重写 end 方法
    res.end = function (this: ServerResponse, chunk?: any, encoding?: any, cb?: (() => void)) { 
        // 如果已经结束，则直接返回
        if (isEnded) {
            return this as any;
        }
        // 如果 chunk 不为 null，则将 chunk 转换为 Buffer
        if (chunk != null) {
            const buffer = Buffer.isBuffer(chunk)
                ? chunk
                : Buffer.from(String(chunk), (typeof encoding === 'string' ? encoding : undefined) as BufferEncoding | undefined);
            bufferedChunks.push(buffer);
        }
        //判断是否最后一步
        (res as any).flushEnd();
        // 执行回调函数
        if (typeof cb === 'function') cb();
        // 返回 this
        return this as any;
    } as any;

    (res as any).flushEnd = function() {
        if (isEnded) {
            return;
        }
        isEnded = true;
        const finalBuffer = bufferedChunks.length > 0 ? Buffer.concat(bufferedChunks) : undefined;
        return originEnd(finalBuffer);
    };


    const ctx: Ctx = { 
        req, 
        res,
        // 返回json数据
        json: (input: object) => { 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(input));
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
    } catch (error) { 
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.log(error);
    }
});