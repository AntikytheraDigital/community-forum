const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const TEST_CASES = require('./test_cases/register_user.json')

describe('User', () => {
    describe('/POST register', () => {
        TEST_CASES.forEach(doTest);
    });
});

function doTest({description, user, expectedStatus, expectedMessage, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(expectedStatus);
                    res.body.should.have.property('message').eql(expectedMessage);
                    if (expectedError) {
                        res.body.should.have.property('error').eql(expectedError);
                    }
                    done();
                }
            });
    });
}
