// middleware/middleware.ts
import { Ctx } from '../types';

export type wrapMiddleware = (ctx: Ctx, next: () => Promise<void>, pre: Map<string,any>) => Promise<void>;
export type pipeMiddleware = (ctx: Ctx) => Promise<void>;