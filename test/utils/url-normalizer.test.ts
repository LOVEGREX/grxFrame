import { strict as assert } from 'assert';
import { normalized } from '../../dist/grx-web/utils/url-normalizer';

describe('URL Normalizer', () => {
  it('should add leading slash if missing', () => {
    assert.equal(normalized('test'), '/test/');
  });

  it('should add trailing slash if missing', () => {
    assert.equal(normalized('/test'), '/test/');
  });

  it('should remove query parameters', () => {
    assert.equal(normalized('/test?param=value'), '/test/');
  });

  it('should handle already normalized URLs', () => {
    assert.equal(normalized('/test/'), '/test/');
  });
});