const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');
const authentication = require('../middleware/authentication');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        let boards = await boardController.handleGetBoards();

        let options = {posts: result, boards: boards};

        await authentication.checkLoggedIn(req, res, options);

        res.render('homeView', options);
    });

    app.get('/login', (req, res) => {
        res.clearCookie('JWT');
        res.render('loginView');
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('JWT');
        res.redirect('/');
    });

    app.get('/board/:boardName', async (req, res) => {
        let result = await boardController.handleGetBoardPosts(req.params.boardName);

        let options = {posts: result, boardName: req.params.boardName};

        await authentication.checkLoggedIn(req, res, options);

        res.render('boardView', options);
    });

    app.post('/login', async (req, res) => {
        let result = await authController.handleLogin(req.body, res);

        if (result[0] === 200) {
            res.redirect('/');
        } else {
            res.render('loginView', {error: result[1]});
        }
    });

    app.get('/register', (req, res) => {
        res.clearCookie('JWT');
        res.render('registerView');
    });

    app.post('/register', async (req, res) => {
        res.clearCookie('JWT');
        let result = await authController.handleSubmit(req.body);

        if (result[0] === 201) {
            res.render('registerView', {success: result[1]});
        } else {
            res.render('registerView', {error: result[1]});
        }
    });

    app.get('/board/:boardName/posts/:postID', async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        let options = {post: result, title: title};

        await authentication.checkLoggedIn(req, res, options);

        res.render('postView', options);
    });

    app.post('/board/:boardName/posts/:postID', async (req, res) => {
        let result = JSON.parse(req.body.post);

        let options = {post: result, title: result.title};

        await authentication.checkLoggedIn(req, res, options);

        res.render('postView', options);

        // TODO: Handle adding comment after rendering (process adding after page render)
        console.log("Adding comment to post: " + req.body.comment);
    });
}