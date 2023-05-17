const express = require('express');

const app = express();

app.get('/', function(req, res){
    res.send('Olá Mundo!');
});

app.get('/sobre', function(req, res){
    res.send('<h1>Está é a página sobre</h1>');
})

app.listen(3000, function(){
    console.log('App de Exemplo escutando na porta 3000');
});
