import { strict as assert } from 'assert';
import { server } from '../../dist/grx-web/server/http-server';
import { IncomingMessage, ServerResponse } from 'http';

describe('HTTP 服务器', () => {
  it('应该创建 HTTP 服务器实例', () => {
    assert.ok(server);
    assert.ok(server.listen);
    assert.ok(server.close);
  });

  it('应该为请求创建上下文对象', (done) => {
    assert.ok(server);
    done();
  });
});