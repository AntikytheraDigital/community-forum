const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);

describe('Board', () => {
    //TODO remove this before function to run the test after API is implemented
    before(function () {
            this.skip();
    })
    describe('/GET', () => {
        it('return specific board', (done) => {
            chai.request(server)
                .get('/board/bmx')
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.have.property('board');
                        res.body.board.should.have.property('name').eql('BMX');
                        done();
                    }
                });
        });
    });
});