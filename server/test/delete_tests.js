const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const DELETE_POSTS_CASES = require('./test_cases/delete_post.json');
chai.use(chaiHttp);
const utils = require('./utils');
const Post = require("../models/post");

describe('/DELETE tests', () => {
    beforeEach(function (done) {
        utils.resetDB();
        done();
    });
    describe('Posts', () => {
        DELETE_POSTS_CASES.forEach(doDelete);
    });
});

function doDelete({description, uri, jwt, expectedStatus, tryGet}) {
    it(description, (done) => {
        chai.request(server)
            .delete(uri)
            .set('jwt', jwt ? jwt : '')
            .end((err, res) => {
                if (expectedStatus !== res.status) console.log(res.body);
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(expectedStatus);
                    if (tryGet) {
                        chai.request(server)
                            .get(uri)
                            .end((err, res) => {
                                if (err) {
                                    done(err);
                                } else {
                                    res.should.have.status(tryGet.expectedStatus);
                                    done()
                                }
                            });
                    } else done();
                }
            });
    });
}