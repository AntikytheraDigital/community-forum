const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        res.render('homeView', {posts: result});
    });

    app.get('/login', (req, res) => {
        res.render('loginView');
    });

    app.get('/board/:boardName', async (req, res) => {
        // just using all posts as a placeholder until later 
        let result = await boardController.handleGetBoardPosts(req.params.boardName);
        console.log("RESULTTTTT ", result);
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

        res.render('postView', {post: result, title: title});
    });
}