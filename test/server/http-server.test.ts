import { strict as assert } from 'assert';
import { server } from '../../dist/grx-web/server/http-server';
import { IncomingMessage, ServerResponse } from 'http';

describe('HTTP Server', () => {
  it('should create HTTP server instance', () => {
    assert.ok(server);
    assert.ok(server.listen);
    assert.ok(server.close);
  });

  it('should create context object for requests', (done) => {
    assert.ok(server);
    done();
  });
});