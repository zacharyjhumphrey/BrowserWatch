const path = require('path');
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

// Serving static files
app.use(express.static(path.join(__dirname, 'build')));

// Serving dependencies
app.use('/modules', express.static(path.join(__dirname, './node_modules/')));

// Render the main page
app.get('/', (req, res) => {
  res.render('public/index.html');
})

app.listen(port);