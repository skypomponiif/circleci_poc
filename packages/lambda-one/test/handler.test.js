const mocha = require('mocha');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const handler = require('../src/handler');

describe("The handler function", () => {
    before(() => {
        result = handler.hello({}, () => {})
    })

    it("returns a status code equal 200", () => {
        return expect(result).to.eventually.have.property('statusCode').equal(200);
    });
});