const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let server = require('../app');
chai.use(chaiHttp);

describe('User', () => {
    describe('/POST register', () => {
        it('Register a valid user', (done) => {
            const user = {
                email: 'user@example.com',
                username: 'testUser',
                password: 'testPassword@123'
            };
            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    if (err) {
                        // Call done with the error to signal test completion with an error
                        done(err);
                    } else {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Registration successful');
                        // Call done to signal test completion without errors
                        done();
                    }
                });
        });
    });
});
