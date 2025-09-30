// test/middleware/middleware-chain.test.ts
import { strict as assert } from 'assert';
import { use, usePipe, middlewares, pipeMiddlewares, handleRequast } from '../../grx-web/middleware/middleware-chain';
import { WrapMiddleware, PipeMiddleware } from '../../grx-web/middleware/middleware';
import { Ctx } from '../../grx-web/types';

describe('Middleware Chain', () => {
  beforeEach(() => {
    // 清理中间件数组
    while (middlewares.length > 0) {
      middlewares.pop();
    }
    while (pipeMiddlewares.length > 0) {
      pipeMiddlewares.pop();
    }
  });

  it('should add wrap middleware to middlewares array', () => {
    const middleware: WrapMiddleware = async (ctx, next) => {};
    
    use(middleware);
    
    assert.equal(middlewares.length, 1);
    assert.equal(middlewares[0], middleware);
  });

  it('should add pipe middleware to pipeMiddlewares array', () => {
    const middleware: PipeMiddleware = async (ctx) => {};
    
    usePipe(middleware);
    
    assert.equal(pipeMiddlewares.length, 1);
    assert.equal(pipeMiddlewares[0], middleware);
  });

  it('should execute middleware in order', async () => {
    const executionOrder: number[] = [];

    const m1: WrapMiddleware = async (ctx, next) => {
      executionOrder.push(1);
      await next();
      executionOrder.push(6);
    };

    const m2: WrapMiddleware = async (ctx, next) => {
      executionOrder.push(2);
      await next();
      executionOrder.push(5);
    };

    const m3: WrapMiddleware = async (ctx, next) => {
      executionOrder.push(3);
      await next();
      executionOrder.push(4);
    };

    use(m1);
    use(m2);
    use(m3);

    const ctx: Ctx = {
      req: { url: '/', headers: { host: 'localhost' } } as any,
      res: { writeHead() {}, end() {} } as any,
      json: (input: object) => {},
      middlewaredData: new Map(),
      getMiddlewareData: (key: string) => ctx.middlewaredData.get(key),
      setMiddlewareData: (key: string, value: any) => { ctx.middlewaredData.set(key, value); }
    };

    await handleRequast(ctx);
    assert.deepEqual(executionOrder, [1,2,3,4,5,6]);
  });

  it('should throw if next() is called multiple times', async () => {
    const bad: WrapMiddleware = async (ctx, next) => {
      await next();
      await next();
    };
    use(bad);

    const ctx: Ctx = {
      req: { url: '/', headers: { host: 'localhost' } } as any,
      res: { writeHead() {}, end() {} } as any,
      json: (input: object) => {},
      middlewaredData: new Map(),
      getMiddlewareData: (key: string) => ctx.middlewaredData.get(key),
      setMiddlewareData: (key: string, value: any) => { ctx.middlewaredData.set(key, value); }
    };

    await assert.rejects(() => handleRequast(ctx), /next\(\) called multiple times/);
  });

  it('should execute pipe middlewares in order after wraps', async () => {
    const pipeOrder: number[] = [];
    const w: WrapMiddleware = async (ctx, next) => { await next(); };
    use(w);
    usePipe(async (ctx) => { pipeOrder.push(1); });
    usePipe(async (ctx) => { pipeOrder.push(2); });

    const ctx: Ctx = {
      req: { url: '/', headers: { host: 'localhost' } } as any,
      res: { writeHead() {}, end() {} } as any,
      json: (input: object) => {},
      middlewaredData: new Map(),
      getMiddlewareData: (key: string) => ctx.middlewaredData.get(key),
      setMiddlewareData: (key: string, value: any) => { ctx.middlewaredData.set(key, value); }
    };

    await handleRequast(ctx);
    assert.deepEqual(pipeOrder, [1, 2]);
  });
});