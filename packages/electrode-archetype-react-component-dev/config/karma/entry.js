"use strict";

/**
 * Test setup for client-side tests.
 *
 * Intended for:
 * - Karma tests: `npm run test-client`
 * - Browser tests: `http://localhost:4000/test/client/test.html`
 */
/*globals window:false*/
var chai = require("chai");
var sinonChai = require("sinon-chai");
var chaiShallowly = require("chai-shallowly");
var Enzyme = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

/*
 * We need a global sinon to maintain compatibility
 * with existing test suites. However, this will be
 * removed in the future and is being tracked by
 */
window.sinon = require("sinon");

// --------------------------------------------------------------------------
// Chai / Sinon / Mocha configuration.
// --------------------------------------------------------------------------
// Exports
window.expect = chai.expect;

// Plugins
chai.use(sinonChai);
chai.use(chaiShallowly);

// Mocha (part of static include).
window.mocha.setup({
  ui: "bdd",
  bail: false
});

// --------------------------------------------------------------------------
// Bootstrap
// --------------------------------------------------------------------------
// Use webpack to include all app code _except_ the entry point so we can get
// code coverage in the bundle, whether tested or not.
var srcReq = require.context("src", true, /\*\*\/(!(spec|test))*\.(jsx|js)?$/);
srcReq.keys().map(srcReq);

// Use webpack to infer and `require` tests automatically.
var testsReq = require.context("test/client", true, /\.spec.jsx?$/);
testsReq.keys().map(testsReq);

// Only start mocha in browser.
if (!window.__karma__) {
  window.mocha.run();
}
