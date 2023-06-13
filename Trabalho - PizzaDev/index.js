//#region Configuração do MySQL
const mysql = require('mysql2/promise');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "M1t0%3v3",
        database: "pizzadev"
    });
    return connection;
}
//#endregion
//#region Configuração do Handlebars
const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
app.engine('hbs', exphbs.engine({
    extname: ".hbs"
}))
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extends: true}));
//#endregion

//#region Requerimentos de páginas
app.get("/", (req,res) => res.render("home"));
//#endregion

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})