const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');
const authentication = require('../middleware/authentication');

module.exports = function (app) {
    app.get('/', async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        let boards = await boardController.handleGetBoards();

        let options = {posts: result, boards: boards};

        authController.addUsername(req, res, options);

        res.render('homeView', options);
    });

    app.get('/login', (req, res) => {
        authentication.logoutUser(res);
        res.render('loginView');
    });

    app.get('/logout', (req, res) => {
        authentication.logoutUser(res);
        res.redirect('/');
    });

    app.get('/board/:boardName', async (req, res) => {
        let result = await boardController.handleGetBoardPosts(req.params.boardName);

        let options = {posts: result, boardName: req.params.boardName};

        authController.addUsername(req, res, options);

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
        authentication.logoutUser(res);
        res.render('registerView');
    });

    app.get('/board/:boardName/addPost', async (req, res) => {
        let options = {boardName: req.params.boardName};

        authController.addUsername(req, res, options);

        res.render('addPostView', options)
    });


    app.post('/board/:boardName/addPost', async (req, res) => {
        let options = {boardName: req.params.boardName};

        authController.addUsername(req, res, options);

        let result = await postController.handleWritePost(req.body.title, req.body.content, options);

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
            return;
        }

        if (result.status === 401) {
            authentication.logoutUser(res);
        }

        if (result.error && result.error === "jwt malformed") {
            res.render('addPostView', {error: "you must be logged in to post", boardName: req.params.boardName});
        } else {
            res.render('addPostView', {error: result.error, boardName: req.params.boardName});
        }
    });

    //delete post route 
    app.post('/board/:boardName/posts/:postID/delete', async (req, res) => {
        let options = {postID: req.params.postID};

        authController.addUsername(req, res, options);

        let result = await postController.handleDeletePost(options);

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
            return;
        }

        if (result.status === 401) {
            authentication.logoutUser(res);
        }

        // Handle error (e.g., render an error page or redirect with an error message)
        res.redirect(`/board/${req.params.boardName}/posts/${req.params.postID}`);
    });

    app.post('/register', async (req, res) => {
        authentication.logoutUser(res);
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

        authController.addUsername(req, res, options);

        res.render('postView', options);
    });

    // this happens when you add a comment (you make a post request on a post page)
    app.post('/board/:boardName/posts/:postID/addComment', async (req, res) => {
        try {
            if (!req.body || !req.body.postID) {
                throw new Error("Post not found.");
            }

            let options = {postID: req.body.postID, comment: req.body.comment};

            authController.addUsername(req, res, options);

            console.log("Adding comment to post: " + req.body.comment);

            res.status(201).send({success: true});

            let result = await postController.handleWriteComment(options);

            if (result.status === 401) {
                authentication.logoutUser(res);
            }

        } catch (error) {
            res.status(500).send({error: "Error adding comment."});
        }
    });

    // Route to show the edit post view
    app.get('/board/:boardName/posts/:postID/edit', async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        let options = {post: result, title: title};

        authController.addUsername(req, res, options);

        res.render('editPostView', options);
    });

    // Route to handle the edit post submission
    app.post('/board/:boardName/posts/:postID/edit', async (req, res) => {
        let options = {boardName: req.params.boardName};

        authController.addUsername(req, res, options);

        let result = await postController.handleEditPost(req.params.postID, req.body.title, req.body.content, options);

        if (result.status === 401) {
            authentication.logoutUser(res);
        }

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
        } else {
            res.render('editPostView', {error: result.error, post: result.post});
        }
    });

    app.get('/oauth/login', async (req, res) => {
        let result = await authController.getOAuthURL();

        if (result.error) {
            res.render('loginView', {error: result.error});
            return;
        }

        res.redirect(result.url);
    });

    app.get('/oauth/callback', async (req, res) => {
        let result = await authController.handleOAuthLogin(req, res);

        console.log(result);

        if (result.status === 200) {
            res.redirect('/');
            return;
        }

        res.render('loginView', {error: result.error});
    });
}