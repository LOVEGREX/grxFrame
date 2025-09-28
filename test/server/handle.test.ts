import { strict as assert } from 'assert';
import { handler } from '../../dist/grx-web/server/handle';
import { registerRoute } from '../../dist/grx-web/router/router-resgistry';
import { Ctx } from '../../dist/grx-web/types';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

describe('Server Handler', () => {
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
    
    // 重置路由器注册表
    delete require.cache[require.resolve('../../dist/grx-web/router/router-resgistry')];
  });

  it('should call registered route handler', async () => {
    let handlerCalled = false;
    const testHandler = (ctx: Ctx) => {
      handlerCalled = true;
    };

    registerRoute('GET', '/test/', testHandler);
    
    const url = new URL('http://localhost/test/');
    await handler(mockCtx, mockReq, mockRes, url);
    
    assert.ok(handlerCalled);
  });

  it('should return 404 for unregistered route', async () => {
    const url = new URL('http://localhost/non-existent/');
    
    await handler(mockCtx, mockReq, mockRes, url);
    
    assert.equal(mockRes.statusCode, 404);
  });

  it('should handle routes with different HTTP methods', async () => {
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
    await handler(mockCtx, mockReq, mockRes, getUrl);
    
    assert.ok(getHandlerCalled);
    assert.ok(!postHandlerCalled);
  });
});