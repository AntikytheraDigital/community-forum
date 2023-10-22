const authController = require('../controllers/authController');
const boardController = require('../controllers/boardController');
const postController = require('../controllers/postController');

module.exports = function (app) {
    async function checkAuth(req, res, next) {
        await authController.getNewAccessToken(req, res);

        let options = {};
        authController.addUsername(req, res, options);
        req.options = options;
        next();
    }

    app.get('/', checkAuth, async (req, res) => {
        let result = await boardController.handleGetAllPosts();
        let boards = await boardController.handleGetBoards();

        const options = {...req.options, posts: result, boards: boards};

        res.render('homeView', options);
    });

    app.get('/login', async (req, res) => {
        await authController.logoutUser(req, res);
        res.render('loginView');
    });

    app.get('/logout', async (req, res) => {
        await authController.logoutUser(req, res);
        res.redirect('/');
    });

    app.get('/board/:boardName', checkAuth, async (req, res) => {
        let result = await boardController.handleGetBoardPosts(req.params.boardName);

        const options = {...req.options, posts: result, boardName: req.params.boardName};

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

    app.get('/register', async (req, res) => {
        await authController.logoutUser(req, res);
        res.render('registerView');
    });

    app.get('/board/:boardName/addPost', checkAuth, async (req, res) => {
        const options = {...req.options, boardName: req.params.boardName};

        res.render('addPostView', options)
    });


    app.post('/board/:boardName/addPost', checkAuth, async (req, res) => {
        const options = {...req.options, boardName: req.params.boardName};

        let result = await postController.handleWritePost(req.body.title, req.body.content, options);

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
            return;
        }

        if (result.status === 401) {
            await authController.logoutUser(req, res);
        }

        if (result.error && result.error === "jwt malformed") {
            res.render('addPostView', {error: "you must be logged in to post", boardName: req.params.boardName});
        } else {
            res.render('addPostView', {error: result.error, boardName: req.params.boardName});
        }
    });

    //delete post route
    app.post('/board/:boardName/posts/:postID/delete', checkAuth, async (req, res) => {
        const options = {...req.options, postID: req.params.postID};

        let result = await postController.handleDeletePost(options);

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
            return;
        }

        if (result.status === 401) {
            await authController.logoutUser(req, res);
        }

        // Handle error (e.g., render an error page or redirect with an error message)
        res.redirect(`/board/${req.params.boardName}/posts/${req.params.postID}`);
    });

    app.post('/register', async (req, res) => {
        await authController.logoutUser(req, res);
        let result = await authController.handleSubmit(req.body);

        if (result[0] === 201) {
            res.render('registerView', {success: result[1]});
        } else {
            res.render('registerView', {error: result[1]});
        }
    });

    app.get('/board/:boardName/posts/:postID', checkAuth, async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        const options = {...req.options, post: result, title: title};

        res.render('postView', options);
    });

    // this happens when you add a comment (you make a post request on a post page)
    app.post('/board/:boardName/posts/:postID/addComment', checkAuth, async (req, res) => {
        let statusSent = false;
        try {
            if (!req.body || !req.body.postID) {
                throw new Error("Post not found.");
            }

            const options = {...req.options, postID: req.body.postID, comment: req.body.comment};

            res.status(201).send({success: true});
            statusSent = true;

            let result = await postController.handleWriteComment(options);

            if (result.status === 401) {
                await authController.logoutUser(req, res);
            }

        } catch (error) {
            if (!statusSent) res.status(500).send({error: "Error adding comment."});
        }
    });

    // Route to show the edit post view
    app.get('/board/:boardName/posts/:postID/edit', checkAuth, async (req, res) => {
        let result = await postController.handleGetPost(req.params.postID);
        let title = result.title ? result.title : "Invalid Post";

        const options = {...req.options, post: result, title: title};

        res.render('editPostView', options);
    });

    // Route to handle the edit post submission
    app.post('/board/:boardName/posts/:postID/edit', checkAuth, async (req, res) => {
        const options = {...req.options, boardName: req.params.boardName};

        let result = await postController.handleEditPost(req.params.postID, req.body.title, req.body.content, options);

        if (result.status === 401) {
            await authController.logoutUser(req, res);
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