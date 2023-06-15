//#region Configuração do MySQL
const mysql = require('mysql2/promise');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Mito%Eve99",
        database: "pizzadev"
    });
    return connection;
}
async function consulta(sql = '', values = []) {
    const conn = await getConnection();
    const resultado = await conn.query(sql, values);
    conn.end();

    return resultado[0];
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
app.get("/", async (req,res) => {
    var arrayPizzas = await consulta("SELECT * FROM pizzas");
    res.render("home", {isHome: true, pizza: arrayPizzas})
});
app.post("/", async (req,res) => {
    var arrayPizzas = await consulta("SELECT * FROM pizzas");
    const [maxID] = await consulta("SELECT MAX(id) AS valor FROM mensagens");
    var nextID = 0;
    if (maxID.valor != NaN && maxID.valor != null) nextID = maxID.valor+1;

    const {nome, email, assunto, mensagem} = req.body;
    const sql = "INSERT INTO mensagens VALUES (?, ?, ?, ?, ?)";
    const values = [nextID, nome, email, assunto, mensagem];
    await consulta(sql, values);
    
    res.render("home", {isHome: true, pizza: arrayPizzas})
});

app.get("/admin/cadastrar_pizza", (req,res) => res.render('admin/cadastrar_pizza', {titulo: "Cadastrar Pizza | Administração | ", hasHeader: true, isPizzas: true}));

app.get("/admin/cadastrar-usuario", (req,res) => res.render('admin/cadastrar-usuario', {titulo: "Cadastrar Usuário | Administração | ", hasHeader: true, isUsuarios: true}));

app.get("/admin/editar-pizza", (req,res) => {
    res.render('admin/editar-pizza', {titulo: "Editar Pizza | Administração | ", hasHeader: true, isPizzas: true})
});
app.get("/admin/editar-pizza", (req,res) => {
    res.render('admin/editar-pizza', {titulo: "Editar Pizza | Administração | ", hasHeader: true, isPizzas: true})
});

app.get("/admin", async (req,res) => {
    const arrayPizzas = await consulta("SELECT * FROM pizzas");
    res.render('admin/index', {titulo: "Nossas Pizzas | Administração | ", pizza: arrayPizzas, hasHeader: true, isPizzas: true})
});

app.get("/admin/login", (req,res) => res.render('admin/login', {titulo: "Login | Administração | "}));

app.get("/admin/mensagens", (req,res) => {
    res.render('admin/mensagens', {titulo: "Mensagens | Administração | ", hasHeader: true, isMensagens: true})
});

app.get("/admin/usuarios", (req,res) => {
    res.render('admin/usuarios', {titulo: "Usuários | Administração | ", hasHeader: true, isUsuarios: true})
});
//#endregion

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})