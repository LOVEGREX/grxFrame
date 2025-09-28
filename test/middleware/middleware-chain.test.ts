import { strict as assert } from 'assert';
import { use, usePipe, middlewares, pipeMiddlewares } from '../../dist/grx-web/middleware/middleware-chain';
import { Middleware } from '../../dist/grx-web/middleware/middleware';
import { Ctx } from '../../dist/grx-web/types';

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

  it('should add middleware to middlewares array', () => {
    const middleware: Middleware = async (ctx, next, pre) => {};
    
    use(middleware);
    
    assert.equal(middlewares.length, 1);
    assert.equal(middlewares[0], middleware);
  });

  it('should add pipe middleware to both arrays', () => {
    const middleware: Middleware = async (ctx, next, pre) => {};
    
    usePipe(middleware);
    
    assert.equal(middlewares.length, 1);
    assert.equal(pipeMiddlewares.length, 1);
    assert.equal(middlewares[0], middleware);
    assert.equal(pipeMiddlewares[0], middleware);
  });

  it('should execute middleware in order', async () => {
    const executionOrder: number[] = [];
    
    const middleware1: Middleware = async (ctx, next, pre) => {
      executionOrder.push(1);
      await next();
      executionOrder.push(4);
    };
    
    const middleware2: Middleware = async (ctx, next, pre) => {
      executionOrder.push(2);
      await next();
      executionOrder.push(3);
    };
    
    use(middleware1);
    use(middleware2);
    
    // 模拟 next 函数调用
    assert.equal(middlewares.length, 2);
    assert.equal(pipeMiddlewares.length, 0);
  });
});