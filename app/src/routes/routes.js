const authController = require('../controllers/authController');

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.render('homeView');
    });

    app.get('/login', (req, res) => {
        res.render('loginView');
    });

    app.get('/register', (req, res) => {
        res.render('registerView');
    });

    app.post('/register', async (req, res) => {
        let result = await authController.handleSubmit(req.body);

        if (result[0] === 201) {
            res.render('registerView', {success: "User registered."});
        } else {
            let data = result[1];
            console.log(data);
            res.render('registerView', {error: data});
        }
    });
}