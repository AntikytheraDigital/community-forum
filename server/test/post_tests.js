const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const POST_USER_CASES = require('./test_cases/register_user.json')
const POST_POST_CASES = require('./test_cases/create_post.json')

describe('/POST tests', () => {
    describe('User registration', () => {
        POST_USER_CASES.forEach(doPost);
    });
    describe('Create Post', () => {
        POST_POST_CASES.forEach(doPost);
    });
});

function doPost({description, uri, data, expectedStatus, expectedMessage, expectedError}) {
    // Make test request to server and log error
    try {
        chai.request(server).post(uri).send(data).end((err, res) => {
            console.log("TEST: ", err);
            console.log("TEST: ", res);
        });
    } catch (err) {
        console.log("TEST: ", err);
    }

    it(description, (done) => {
        chai.request(server)
            .post(uri)
            .send(data)
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
