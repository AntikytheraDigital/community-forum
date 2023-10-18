const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
const POST_USER_CASES = require('./test_cases/register_user.json')
const POST_POST_CASES = require('./test_cases/create_post.json')
const Board = require("../models/board");
const User = require("../models/user");
const MODEL_DATA = require("./test_cases/model_data.json");

describe('/POST tests', () => {
    beforeEach(async () => {
        await Board.deleteMany({});
        await User.deleteMany({});
        MODEL_DATA.boards.forEach((model) => {
            const newBoard = new Board(model);
            newBoard.save();
        });
        MODEL_DATA.users.forEach((model) => {
            const newUser = new User(model);
            newUser.save();
        });
    });
    describe('User registration', () => {
        POST_USER_CASES.forEach(doPost);
    });
    describe('Create Post', () => {
        POST_POST_CASES.forEach(doPost);
    });
});

function doPost({description, uri, data, expectedStatus, expectedMessage, expectedError}) {
    it(description, (done) => {
        chai.request(server)
            .post(uri)
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
