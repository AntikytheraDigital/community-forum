const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Board = require('../models/board');
const server = require('../app');
const GET_BOARD_CASES = require('./test_cases/get_board.json');
const MODEL_DATA = require('./test_cases/model_data.json');
chai.use(chaiHttp);

describe('/GET tests', () => {
    beforeEach(() => {
        Board.deleteMany({});
        MODEL_DATA.boards.forEach((model) => {
            const newBoard = new Board(model);
            newBoard.save();
        });
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
