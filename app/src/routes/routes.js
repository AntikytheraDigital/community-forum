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
        res.clearCookie('JWT');
        res.clearCookie('username');
        res.render('loginView');
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('JWT');
        res.clearCookie('username');
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
        res.clearCookie('JWT');
        res.clearCookie('username');
        res.render('registerView');
    });

    app.get('/board/:boardName/addPost', async (req, res) => {
        let options = {boardName: req.params.boardName};

        authController.addUsername(req, res, options);

        res.render('addPostView', options)
    });


    app.post('/board/:boardName/addPost', async (req, res) => {
        let options = {boardName: req.params.boardName};

        await authentication.checkLoggedIn(req, res, options);
    
        let result = await postController.handleWritePost(req.params.boardName, req.body.title, req.body.content, options.username, req.cookies.JWT);
    
        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
            return;
        }

        if(result.error && result.error === "jwt malformed"){
            res.render('addPostView', { error: "you must be logged in to post", boardName: req.params.boardName });
        }
        else {
            res.render('addPostView', { error: result.error, boardName: req.params.boardName });
        }
    });

    //delete post route 
    app.post('/board/:boardName/posts/:postID/delete', async (req, res) => {
        options = {};
        
        await authentication.checkLoggedIn(req, res, options);
        
        let result = await postController.handleDeletePost(req.params.postID, req.cookies.JWT);
    
        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
        } else {
            // Handle error (e.g., render an error page or redirect with an error message)
            res.redirect(`/board/${req.params.boardName}/posts/${req.params.postID}`);
        }
    });
    

    app.post('/register', async (req, res) => {
        res.clearCookie('JWT');
        res.clearCookie('username');
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
            let result;

            if (!req.body || !req.body.post) {
                throw new Error("Post not found.");
            }

            if (typeof req.body.post === 'string') {
                result = JSON.parse(req.body.post);
            } else {
                result = req.body.post;
            }

            if (!result || !result.title) {
                throw new Error("Post not found.");
            }

            let options = {post: result, title: result.title};

            await authentication.checkLoggedIn(req, res, options);

            res.render('postView', options);

            console.log("Adding comment to post: " + req.body.comment);
            await postController.handleWriteComment(req.body.post._id, req.body.comment, options.username, req.cookies.JWT);
        } catch (error) {
            res.render('postView', {error: "Error adding comment."});
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

        await authentication.checkLoggedIn(req, res, options);

        let result = await postController.handleEditPost(req.params.postID, req.body.title, req.body.content, req.cookies.JWT);

        if (result.success) {
            res.redirect(`/board/${req.params.boardName}`);
        } else {
            res.render('editPostView', { error: result.error, post: result.post });
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