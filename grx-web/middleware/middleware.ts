// middleware/middleware.ts
import { Ctx } from '../types';

export type WrapMiddleware = (ctx: Ctx, next: () => Promise<void>) => Promise<void>;
export type PipeMiddleware = (ctx: Ctx) => Promise<void>;