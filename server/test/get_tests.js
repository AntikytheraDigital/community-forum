const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const GET_BOARD_CASES = require('./test_cases/get_board.json');
chai.use(chaiHttp);
const utils = require('./utils');

describe('/GET tests', () => {
    beforeEach(() => {
        utils.resetDB();
    });
    describe('Boards', () => {
        GET_BOARD_CASES.forEach(doGet);
    });
});

function doGet({description, uri, expectedStatus, expectedMessage, expectedPost, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .get(uri)
            .end((err, res) => {
                if(expectedStatus!==res.status) console.log(res.body);
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(expectedStatus);
                    res.body.should.have.property('boards');
                    res.body.boards.should.be.a('array');
                    console.log(res.body.boards);
                    done();
                }
            });
    });
}
