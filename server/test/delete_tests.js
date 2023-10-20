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
    describe('Comments', () => {
        it('should delete a comment', (done) => {
            chai.request(server)
                .delete("/posts/comments")
                .set('jwt',"{\"username\": \"testauthor\"}")
                .query({
                    postID: "5e1a0651741b255ddda996c4",
                    commentID: "5e1a0651741b255ddda996c5"
                })
                .end((err, res) => {
                    console.log(res.body)
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        let post = Post.findById("5e1a0651741b255ddda996c4");
                        post.should.not.have.property("comments");
                        done();
                    }
                });
        });
        it('should not delete a comment with bad jwt header', (done) => {
            chai.request(server)
                .delete("/posts/comments")
                .set('jwt',"{\"username\": \"author\"}")
                .query({
                    postID: "5e1a0651741b255ddda996c4",
                    commentID: "5e1a0651741b255ddda996c5"
                })
                .end(async (err, res) => {
                    console.log(res.body)
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(400);
                        let post = await Post.findById("5e1a0651741b255ddda996c4");
                        post.should.have.property("comments");
                        done();
                    }
                });
        });
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