const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');
const GET_POST_CASES = require('./test_cases/get_post.json');

chai.use(chaiHttp);

describe('/GET tests', () => {
    before(function () {
        this.skip();
    })
    describe('Post', () => {
        GET_POST_CASES.forEach(doGet);
    });
});

function doGet({description, uri, expectedStatus, expectedMessage, expectedPost, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .get(uri)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(expectedStatus);
                    res.body.should.have.property('message').eql(expectedMessage);
                    if (expectedError) {
                        res.body.should.have.property('error').eql(expectedError);
                    } else {
                        res.body.should.have.property('post').eql(expectedPost);
                    }
                    done();
                }
            });
    });
}
