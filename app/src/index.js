const express = require('express');
const app = express();

// Serve static files
 //app.use('/styles', express.static('/public/App.css'));
// app.use('/scripts', express.static('path-to-your-js-folder'));

// set different properties 
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Render EJS template
app.get('/register', (req, res) => {
    res.render('registerView');
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));