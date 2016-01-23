var chai = require("chai");
var sinonChai = require("sinon-chai");
var chaiAsPromised = require("chai-as-promised");



global.expect = chai.expect;
global.should = chai.should;

global.sinon = require("sinon");
chai.use(sinonChai);
chai.use(chaiAsPromised);
