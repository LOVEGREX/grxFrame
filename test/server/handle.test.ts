import { strict as assert } from 'assert';
import { handler } from '../../grx-web/server/handle';
import { registerRoute } from '../../grx-web/router/router-resgistry';
import { Ctx } from '../../grx-web/types';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

describe('服务器处理器', () => {
  let mockReq: IncomingMessage;
  let mockRes: ServerResponse;
  let mockCtx: Ctx;

  beforeEach(() => {
    mockReq = { method: 'GET' } as IncomingMessage;
    mockRes = {
      statusCode: 0,
      end: (data?: any) => {},
      writeHead: (statusCode: number, headers?: any) => {}
    } as unknown as ServerResponse;
    
    mockCtx = {
      req: mockReq,
      res: mockRes,
      json: (input: object) => {},
      middlewaredData: new Map(),
      getMiddlewareData: (key: string) => {},
      setMiddlewareData: (key: string, value: any) => {}
    };
    
    // 重置路由器注册表（重新加载源码模块）
    delete require.cache[require.resolve('../../grx-web/router/router-resgistry')];
  });

  it('应该调用已注册的路由处理器', async () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    registerRoute('GET', '/test/', testHandler);
    
    const url = new URL('http://localhost/test/');
    await handler(mockCtx, url);
    
    assert.ok(handlerCalled);
  });

  it('应该为未注册的路由返回 404', async () => {
    const url = new URL('http://localhost/non-existent/');
    
    await handler(mockCtx, url);
    
    assert.equal(mockRes.statusCode, 404);
  });

  it('应该处理不同 HTTP 方法的路由', async () => {
    let getHandlerCalled = false;
    let postHandlerCalled = false;
    
    const getHandler = (ctx: Ctx) => {
      getHandlerCalled = true;
    };
    
    const postHandler = (ctx: Ctx) => {
      postHandlerCalled = true;
    };

    registerRoute('GET', '/api/resource/', getHandler);
    registerRoute('POST', '/api/resource/', postHandler);
    
    // 测试 GET 请求
    mockReq.method = 'GET';
    const getUrl = new URL('http://localhost/api/resource/');
    await handler(mockCtx, getUrl);
    
    assert.ok(getHandlerCalled);
    assert.ok(!postHandlerCalled);
  });
});