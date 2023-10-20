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
        console.log("board posts: ", result);

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

    app.get('/board/:boardName/addPost', async (req, res) => {
        res.render('addPostView', {boardName: req.params.boardName})
    });


    app.post('/board/:boardName/addPost', async (req, res) => {
        let options = {boardName: req.params.boardName};

        await authentication.checkLoggedIn(req, res, options);
    
        let result = await postController.handleWritePost(req.params.boardName, req.body.title, req.body.content, options.username, req.cookies.JWT);
    
        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
        } else {
            res.render('addPostView', { error: result.error, boardName: req.params.boardName });
        }
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
        // clear local storage when you hit the get endpoint 
    });

    // this happens when you add a comment (you make a post request on a post page)
    app.post('/board/:boardName/posts/:postID/addComment', async (req, res) => {
        console.log("Post request recieved to make a comment");
        let result;
        if (typeof req.body.post === 'string') {
            result = JSON.parse(req.body.post);
        } else {
            result = req.body.post;
        }
        let options = {post: result, title: result.title};

        await authentication.checkLoggedIn(req, res, options);
        //add comment to local storage, so its rendered below, running the client side script and adding the comment to the page to be shown 

        res.render('postView', options);

        console.log("Adding comment to post: " + req.body.comment);
        let commentResult = await postController.handleWriteComment(req.body.post._id, req.body.comment, options.username, req.cookies.JWT);
    
    });


}