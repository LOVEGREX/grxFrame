// test/middleware/middleware.test.ts
import { strict as assert } from 'assert';
import { Ctx } from '../../dist/grx-web/types';
import { WrapMiddleware, PipeMiddleware } from '../../dist/grx-web/middleware/middleware';

describe('Middleware Types', () => {
  it('should define Middleware types correctly', () => {
    // 测试 WrapMiddleware 类型
    const wrapMiddleware: WrapMiddleware = async (ctx, next) => {
      await next();
    };
    
    // 测试 PipeMiddleware 类型
    const pipeMiddleware: PipeMiddleware = async (ctx) => {};
    
    assert.ok(wrapMiddleware);
    assert.ok(pipeMiddleware);
  });

  it('should create context object with required properties', () => {
    const ctx: Ctx = {
      req: {} as any,
      res: {} as any,
      json: (input: object) => {},
      middlewaredData: new Map(),
      getMiddlewareData: (key: string) => {},
      setMiddlewareData: (key: string, value: any) => {}
    };
    
    assert.ok(ctx.req);
    assert.ok(ctx.res);
    assert.ok(ctx.json);
    assert.ok(ctx.middlewaredData);
    assert.ok(typeof ctx.getMiddlewareData === 'function');
    assert.ok(typeof ctx.setMiddlewareData === 'function');
  });
});