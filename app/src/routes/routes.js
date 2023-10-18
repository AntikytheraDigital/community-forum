const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        let boards = await boardController.handleGetBoards();

        // Check if cookie JWT exists
        if (req.cookies.JWT) {
            let loggedIn = await authController.checkLoggedIn(req.cookies.JWT, res);

            if (loggedIn[0] === 200) {
                res.render('homeView', {posts: result, boards: boards, loggedIn: true, username: loggedIn[1]});
                return;
            }
        }

        res.render('homeView', {posts: result, boards: boards});
    });

    app.get('/login', (req, res) => {
        // TODO: Log user out if already logged in
        res.render('loginView');
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('JWT');
        // TODO: Deregister JWT from server
        res.redirect('/');
    });

    app.get('/board/:boardName', async (req, res) => {
        let result = await boardController.handleGetBoardPosts(req.params.boardName);
        res.render('boardView', {posts: result, boardName: req.params.boardName});
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
        // TODO: Log user out if already logged in
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

    app.get('/board/:boardName/posts/:postID', async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        res.render('postView', {post: result, title: title, loggedIn: true});
    });

    app.post('/board/:boardName/posts/:postID', async (req, res) => {
        let result = JSON.parse(req.body.post);
        res.render('postView', {post: result, title: req.body.title, loggedIn: true});

        // TODO: Handle adding comment after rendering (process adding after page render)
        console.log("Adding comment to post: " + req.body.comment);
    });
}