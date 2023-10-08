const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        res.render('homeView', {posts: result});
    });

    app.get('/login', (req, res) => {
        res.render('loginView');
    });

    app.post('/login', async (req, res) => {
        // TODO: Handle login
        res.render('loginView', {error: "Login not implemented."});
    });

    app.get('/register', (req, res) => {
        res.render('registerView');
    });

    app.post('/register', async (req, res) => {
        let result = await authController.handleSubmit(req.body);

        if (result[0] === 201) {
            res.render('registerView', {success: result[1]});
        } else {
            res.render('registerView', {error: result[1]});
        }
    });
}