const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const utils = require('./utils');

describe('/PATCH tests', () => {
    beforeEach(() => {
        utils.resetDB();
    });
});

function doPatch({description, uri, jwt, data, expectedStatus, expectedMessage, expectedError}) {
}
