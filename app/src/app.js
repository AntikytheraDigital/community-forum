const express = require('express');
const app = express();

// Serve static files
app.use('/public', express.static('./public'));

// set different properties 
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./routes/routes')(app);

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));