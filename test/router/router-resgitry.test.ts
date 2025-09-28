import { strict as assert } from 'assert';
import { registerRoute, getRouteHandler } from '../../dist/grx-web/router/router-resgistry';
import { Ctx } from '../../dist/grx-web/types';

describe('Router Registry', () => {
  beforeEach(() => {
    // 清理模块缓存以重置路由器映射
    delete require.cache[require.resolve('../../dist/grx-web/router/router-resgistry')];
  });

  it('should register and retrieve route handler', () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    registerRoute('GET', '/test/', testHandler);
    const retrievedHandler = getRouteHandler('GET', '/test/');

    assert.equal(retrievedHandler, testHandler);
  });

  it('should return null for non-existent route', () => {
    const handler = getRouteHandler('GET', '/non-existent/');
    console.log(handler);
    assert.equal(handler, null);
  });

  it('should register multiple routes for same method', () => {
    const handler1 = (ctx: Ctx) => {};
    const handler2 = (ctx: Ctx) => {};

    registerRoute('GET', '/api/users/', handler1);
    registerRoute('GET', '/api/posts/', handler2);

    const retrievedHandler1 = getRouteHandler('GET', '/api/users/');
    const retrievedHandler2 = getRouteHandler('GET', '/api/posts/');

    assert.equal(retrievedHandler1, handler1);
    assert.equal(retrievedHandler2, handler2);
  });

  it('should register routes for different methods', () => {
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