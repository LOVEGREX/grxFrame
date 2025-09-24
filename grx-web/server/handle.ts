// server/handle.ts
import { Ctx } from '../types';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getRouteHandler } from '../router/router-resgistry';

export async function handler(ctx: Ctx, req: IncomingMessage, res: ServerResponse, url: URL) {
    if (req.method) {
        const handler = getRouteHandler(req.method, url.pathname);
        if (!handler) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
        }
        try {
            await handler(ctx);
        } catch (error) { 
            res.statusCode = 500;
            res.end('Internal Server Error');
            console.log(error);
        }
    }
}