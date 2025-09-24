// server/http-server.ts
import { createServer, IncomingMessage, ServerResponse } from "http";
import { next } from '../middleware/middleware-chain';
import { Ctx } from '../types';

export const server = createServer(async (req, res) => { 
    const ctx: Ctx = { 
        req, 
        res,
        json: (input: object) => { 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(input));
        },
        middlewaredData: new Map<string, any>(),
        getMiddlewareData(key: string){ 
            return this.middlewaredData.get(key);
        },
        setMiddlewareData(key: string, value: any){ 
            this.middlewaredData.set(key, value);
        }
    };
    
    try { 
        await next(ctx, 0);
    } catch (error) { 
        res.statusCode = 500;
        res.end('Internal Server Error');
        console.log(error);
    }
});