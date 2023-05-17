const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname:'.hbs'
}));

app.set('view engine', 'hbs');

// Get para a página principal
app.get('/', (req,res) => res.render('home'))

// Get para as páginas de exercícios
app.get('/ex1', (req,res) => res.render('home', {layout: "ex1"}))
app.post('/ex1', (req,res) => res.render('home', {layout: "ex1", data: variables}))


app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});