'use strict';

suite(tap, 'main', {timeout: 2000}, t => {
  t.test('should be ok', t => {
    t.ok(true);
    t.end();
  });
});
