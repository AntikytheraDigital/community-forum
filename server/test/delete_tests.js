const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const DELETE_POSTS_CASES = require('./test_cases/delete_post.json');
chai.use(chaiHttp);
const utils = require('./utils');

describe('/DELETE tests', () => {
    beforeEach(() => {
        utils.resetDB();
    });
    describe('Posts', () => {
        DELETE_POSTS_CASES.forEach(doDelete);
    });
});

function doDelete({description, uri, jwt, expectedStatus}) {
    it(description, (done) => {
        chai.request(server)
            .delete(uri)
            .set('jwt', jwt ? jwt : '')
            .end((err, res) => {
                if(expectedStatus!==res.status) console.log(res.body);
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(expectedStatus);
                    done();
                }
            });
    });
}