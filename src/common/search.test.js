import { search } from './search';

describe('ticket search', () => {
  function mocks(results) {
    return results.map((result) => {
      const adapter = jest.fn().mockResolvedValue(result);
      return adapter;
    });
  }

  const doc = { title: 'dummy document' };
  const loc = { host: 'dummy.org' };

  it('feeds the location and document to every adapter', (done) => {
    const adapters = mocks([null, null]);

    search(adapters, loc, doc, () => {
      adapters.forEach((scan) => {
        expect(scan).toHaveBeenCalledWith(loc, doc);
      });

      done();
    });
  });

  it('invokes the callback with the first non-null adapter result', (done) => {
    const result = [{ id: '1', title: 'true story' }];
    const adapters = mocks([null, result]);

    search(adapters, loc, doc, (res) => {
      expect(res).toBe(result);
      done();
    });
  });

  it('invokes the callback with null when no adapter created any results', (done) => {
    const adapters = mocks([null, undefined]);

    search(adapters, loc, doc, (res) => {
      expect(res).toBe(null);
      done();
    });
  });
});
