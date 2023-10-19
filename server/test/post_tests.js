const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const POST_USER_CASES = require('./test_cases/register_user.json');
const POST_POST_CASES = require('./test_cases/create_post.json');
const POST_COMMENT_CASES = require('./test_cases/add_comment.json');
const utils = require('./utils');

describe('/POST tests', () => {
    beforeEach(() => {
        utils.resetDB();
    });
    describe('User registration', () => {
        POST_USER_CASES.forEach(doPost);
    });
    describe('Create Post', () => {
        POST_POST_CASES.forEach(doPost);
    });
    describe('Add Comment', () => {
        POST_COMMENT_CASES.forEach(doPost);
    });
});

function doPost({description, uri, jwt, data, expectedStatus, expectedMessage, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .post(uri)
            .set('jwt', jwt ? jwt : '')
            .send(data)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    if (expectedStatus === 201 && res.status !== 201) console.log(res.body)
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
