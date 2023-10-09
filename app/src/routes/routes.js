const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        let boards = await boardController.handleGetBoards();
        res.render('homeView', {posts: result, boards: boards});
    });

    app.get('/login', (req, res) => {
        res.render('loginView');
    });

    app.get('/board/:boardName', async (req, res) => {
        let result = await boardController.handleGetBoardPosts(req.params.boardName);
        res.render('boardView', {posts: result, boardName: req.params.boardName});
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

    app.get('/board/:boardName/posts/:postID', async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        res.render('postView', {post: result, title: title, loggedIn: false});
    });

    app.post('/board/:boardName/posts/:postID', async (req, res) => {
        let result = JSON.parse(req.body.post);
        res.render('postView', {post: result, title: req.body.title, loggedIn: true});

        // TODO: Handle adding comment after rendering (process adding after page render)
        console.log("Adding comment to post: " + req.body.comment);
    });
}