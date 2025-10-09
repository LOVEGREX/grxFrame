import { strict as assert } from 'assert';
import { registerRoute, getRouteHandler } from '../../dist/grx-web/router/router-resgistry';
import { Ctx } from '../../dist/grx-web/types';

describe('路由器注册表', () => {
  beforeEach(() => {
    // 清理模块缓存以重置路由器映射
    delete require.cache[require.resolve('../../dist/grx-web/router/router-resgistry')];
  });

  it('应该能够注册和检索路由处理器', () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    registerRoute('GET', '/test/', testHandler);
    const retrievedHandler = getRouteHandler('GET', '/test/');

    assert.equal(retrievedHandler, testHandler);
  });

  it('应该为不存在的路由返回 null', () => {
    const handler = getRouteHandler('GET', '/non-existent/');
    console.log(handler);
    assert.equal(handler, null);
  });

  it('应该能够为同一方法注册多个路由', () => {
    const handler1 = (ctx: Ctx) => {};
    const handler2 = (ctx: Ctx) => {};

    registerRoute('GET', '/api/users/', handler1);
    registerRoute('GET', '/api/posts/', handler2);

    const retrievedHandler1 = getRouteHandler('GET', '/api/users/');
    const retrievedHandler2 = getRouteHandler('GET', '/api/posts/');

    assert.equal(retrievedHandler1, handler1);
    assert.equal(retrievedHandler2, handler2);
  });

  it('应该能够为不同方法注册路由', () => {
    const getHandler = (ctx: Ctx) => {};
    const postHandler = (ctx: Ctx) => {};

    registerRoute('GET', '/api/resource/', getHandler);
    registerRoute('POST', '/api/resource/', postHandler);

    const retrievedGetHandler = getRouteHandler('GET', '/api/resource/');
    const retrievedPostHandler = getRouteHandler('POST', '/api/resource/');

    assert.equal(retrievedGetHandler, getHandler);
    assert.equal(retrievedPostHandler, postHandler);
  });
});