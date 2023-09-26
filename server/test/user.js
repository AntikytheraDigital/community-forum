const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const TEST_CASES = require('./test_cases/register_user.json')

describe('User', () => {
    describe('/POST register', () => {
        TEST_CASES.forEach(userRegistrationTest);
    });
});

function userRegistrationTest(testCase) {
    it(testCase.description, (done) => {
        chai.request(server)
            .post('/auth/register')
            .send(testCase.user)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(testCase.expectedStatus);
                    res.body.should.have.property('message').eql(testCase.expectedMessage);
                    if (testCase.expectedError) {
                        res.body.should.have.property('error').eql(testCase.expectedError);
                    }
                    done();
                }
            });
    });
}
