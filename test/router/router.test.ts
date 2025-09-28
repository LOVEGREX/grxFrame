import { strict as assert } from 'assert';
import { router } from '../../dist/grx-web/router/router';
import { getRouteHandler } from '../../dist/grx-web/router/router-resgistry';
import { Ctx } from '../../dist/grx-web/types';

describe('Router', () => {
  beforeEach(() => {
    // 重置路由器注册表
    delete require.cache[require.resolve('../../dist/grx-web/router/router-resgistry')];
  });

  it('should register GET route', () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    router.get('/test', testHandler);
    
    const registeredHandler = getRouteHandler('GET', '/test/');
    assert.ok(registeredHandler);
  });

  it('should register POST route', () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    router.post('/test', testHandler);
    
    const registeredHandler = getRouteHandler('POST', '/test/');
    assert.ok(registeredHandler);
  });

  it('should normalize route URLs', () => {
    const testHandler = (ctx: Ctx) => {};

    router.get('api/users', testHandler);
    
    const registeredHandler = getRouteHandler('GET', '/api/users/');
    assert.ok(registeredHandler);
  });
});