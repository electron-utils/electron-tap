'use strict';

// initialize client-side tester
module.exports = {
  // https://github.com/mochajs/mocha/wiki/Detecting-global-leaks
  detectLeak ( name_of_leaking_property ) {
    Object.defineProperty(global, name_of_leaking_property, {
      set() {
        let err = new Error('Global leak happens here!!');
        console.log(err.stack);
        throw err;
      }
    });
  },
};
