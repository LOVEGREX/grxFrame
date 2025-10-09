import { strict as assert } from 'assert';
import { normalized } from '../../dist/grx-web/utils/url-normalizer';

describe('URL 标准化器', () => {
  it('应该在缺少前导斜杠时添加', () => {
    assert.equal(normalized('test'), '/test/');
  });

  it('应该在缺少尾随斜杠时添加', () => {
    assert.equal(normalized('/test'), '/test/');
  });

  it('应该移除查询参数', () => {
    assert.equal(normalized('/test?param=value'), '/test/');
  });

  it('应该处理已经标准化的 URL', () => {
    assert.equal(normalized('/test/'), '/test/');
  });
});