const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const utils = require('./utils');
const POST_PATCH_CASES = require('./test_cases/edit_post.json');

describe('/PATCH tests', () => {
    beforeEach(() => {
        utils.resetDB();
    });
    describe('Edit Posts', () => {
        POST_PATCH_CASES.forEach(doPatch);
    });
});

function doPatch({description, uri, jwt, data, expectedStatus, expectedMessage, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .patch(uri)
            .set('jwt', jwt ? jwt : '')
            .send(data)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    if(expectedStatus!==res.status) console.log(res.body);
                    res.should.have.status(expectedStatus);
                    res.body.should.have.property('message').eql(expectedMessage);
                    if (expectedError) {
                        res.body.should.have.property('error');
                    }
                    done();
                }
            });
    });
}
