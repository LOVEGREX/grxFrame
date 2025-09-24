// middleware/middleware.ts
import { Ctx } from '../types';

export type Middleware = (ctx: Ctx, next: () => Promise<void>, pre: Map<string,any>) => Promise<void>;