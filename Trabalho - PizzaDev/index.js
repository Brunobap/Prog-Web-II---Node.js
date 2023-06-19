//#region Configuração do MySQL
const mysql = require('mysql2/promise');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: "us-cdbr-east-06.cleardb.net",
        user: "b746823ba44d11",
        password: "023d47e2",
        database: "heroku_fd37fe06d7b1684"
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
//#region Configuração dos cookies/sessions
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid').v4;

app.use(cookieParser());
app.use(sessions({
    secret: "thisIsMySecretKey",
    saveUninitialized: true,
    resave: false,
    name: 'Cookie de Sessao',
    cookie: { maxAge: 1000 * 60 * 3 } // 3 minutos
}));
function checkSession(req,res) {
    if (!req.session.usuario) {
        res.redirect("/admin/login");
        return true;
    }
    return false;
}
//#endregion

//#region Requerimentos de páginas
    // Página Home feita
app.get("/", async (req,res) => {
    try {
        var arrayPizzas = await consulta("SELECT * FROM pizzas");        
    } catch (error) {
        console.error(error);
    } finally {
        res.render("home", {isHome: true, pizza: arrayPizzas});
    }
});
app.post("/", async (req,res) => {
    try {
        var arrayPizzas = await consulta("SELECT * FROM pizzas");
        const [maxID] = await consulta("SELECT MAX(id) AS valor FROM mensagens");
        var nextID = 0;
        if (maxID.valor != null) nextID = maxID.valor+1;

        const form = {nome, email, assunto, mensagem} = req.body;
        if (checkForm(form)) {
            const sql = "INSERT INTO mensagens VALUES (?, ?, ?, ?, ?)";
            const values = [nextID, nome, email, assunto, mensagem];
            await consulta(sql, values);
        }
    } catch (error) {
        console.error(error);
    } finally {    
        res.render("home", {isHome: true, pizza: arrayPizzas})
    }
});
    // Qualquer requisição do nível admin
app.use('/admin/*', async function (req, res, next) {
    if (!req.session.usuario && req.cookies.token) {
        try {            
            const resultado = await consulta('SELECT * FROM usuarios WHERE token = ?', [req.cookies.token]);
            if (resultado.length) req.session.usuario = resultado[0];
        } catch (error) {
            console.error(error);
        }
    }
    next()
})
    // Página Cadastrar_Pizza feita
app.get("/admin/cadastrar_pizza", (req,res) => {
    if (checkSession(req,res)) return;
    res.render('admin/cadastrar_pizza', {titulo: "Cadastrar Pizza | Administração | ", hasHeader: true, isPizzas: true})
});
app.post("/admin/cadastrar_pizza", async (req,res) => {  
    if (checkSession(req,res)) return;  
    const [maxID] = await consulta("SELECT MAX(id) AS valor FROM pizzas");
    var nextID = 0;
    if (maxID.valor != null) nextID = maxID.valor+1;

    const form = {nomePizza, descricao, precoBrotinho, precoMedia, precoGrande, foto} = req.body;
    var sucesso = checkForm(form);
    if (sucesso) {
        const sql = "INSERT INTO pizzas VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [nextID, nomePizza, foto, descricao, precoBrotinho, precoMedia, precoGrande];
        await consulta(sql, values);
    }

    res.render('admin/cadastrar_pizza', {titulo: "Cadastrar Pizza | Administração | ", isPost: true, hasSuccess: sucesso, hasHeader: true, isPizzas: true})
});
    // Página Cadastra_Usuario feita
app.get("/admin/cadastrar-usuario", (req,res) => res.render('admin/cadastrar-usuario', {titulo: "Cadastrar Usuário | Administração | ", hasHeader: true, isUsuarios: true}));
app.post("/admin/cadastrar-usuario", async (req,res) => {
    const form = {nomeCompleto, usuario, senha, confirmacaoSenha} = req.body;
    var sucesso = checkForm(form);

    try {
        const [maxID] = await consulta("SELECT MAX(id) AS valor FROM usuarios");
        var nextID = 0;
        if (maxID.valor != null) nextID = maxID.valor+1;
    } catch (error) {
        sucesso = false;
        console.error(error);
    }   

    if (sucesso && senha == confirmacaoSenha) {
        try {
            const sql = "INSERT INTO usuarios VALUES (?, ?, ?, ?, ?)";
            const criptoSenha = criptografar(senha);
            const token = uuidv4();
            const values = [nextID, nomeCompleto, usuario, criptoSenha, token];
            await consulta(sql, values);
        } catch (error) {
            sucesso = false;
            console.error(error);
        }        
    } else sucesso = false;
    res.render('admin/cadastrar-usuario', {titulo: "Cadastrar Usuário | Administração | ", isPost: true, hasSuccess: sucesso, hasHeader: true, isUsuarios: true})
});
    // Página Editar_Pizza feita
app.get("/admin/editar-pizza", (req,res) => {
    if (checkSession(req,res)) return;
    res.render('admin/editar-pizza', {titulo: "Editar Pizza | Administração | ", hasHeader: true, isPizzas: true})
});
app.post("/admin/editar-pizza", async (req,res) => {
    if (checkSession(req,res)) return;
    const id = req.query.id;
    const form = {nomePizza, descricao, precoBrotinho, precoMedia, precoGrande, foto} = req.body;

    var sucesso = checkForm(form);
    if (sucesso) {
        try {            
            const sql = 'UPDATE pizzas SET nome = ?, imgSrc = ?, ingredientes = ?, precoPeq = ?, precoMed = ?, precoGrande = ? WHERE id = ?';
            const values = [nomePizza, foto, descricao, precoBrotinho, precoMedia, precoGrande, id];
            await consulta(sql, values);
        } catch (error) {
            sucesso = false;
            console.error(error);
        }
    }
    res.render('admin/editar-pizza', {titulo: "Editar Pizza | Administração | ", isPost: true, hasSuccess: sucesso, hasHeader: true, isPizzas: true})
});
    // Página Editar_Usuario feita
app.get("/admin/editar-usuario", (req,res) => {
    if (checkSession(req,res)) return;
    res.render('admin/editar-usuario', {titulo: "Editar Usuário | Administração | ", hasHeader: true, isUsuarios: true})
});
app.post("/admin/editar-usuario", async (req,res) => {
    if (checkSession(req,res)) return;
    const id = req.query.id;
    const form = {nomeCompleto, usuario, senha, confirmacaoSenha} = req.body;

    var sucesso = checkForm(form);
    if (sucesso && senha == confirmacaoSenha) {
        try {            
            const usu = await consulta("SELECT nome FROM usuarios WHERE id = ?", [id]);
            if (usu.length != 0) {
                const sql = 'UPDATE usuarios SET nome = ?, usuario = ?, senha = ? WHERE id = ?';
                const values = [nomeCompleto, usuario, senha, id];
                await consulta(sql, values);
            } else {
                sucesso = false;
                console.error("Erro BAD_REQUEST: id digitado na query não exite no banco de dados");
            }
        } catch (error) {
            sucesso = false;
            console.error(error);
        }
    } else sucesso = false;
    res.render('admin/editar-usuario', {titulo: "Editar Usuario | Administração | ", isPost: true, hasSuccess: sucesso, hasHeader: true, isUsuarios: true})
});
    // Página Admin feita
app.get("/admin", async (req,res) => {
    if (checkSession(req,res)) return;
    if (req.query.deletar != '' && req.query.deletar != null) {
        try {
            const sql = "DELETE FROM pizzas WHERE id = ?";
            await consulta(sql, req.query.deletar);
        } catch (error) {
            console.error(error);
        }
    }
    var arrayPizzas = null;
    try {
        arrayPizzas = await consulta("SELECT * FROM pizzas");
    } catch (error) {
        console.error(error);
    }
    res.render('admin/index', {titulo: "Nossas Pizzas | Administração | ", pizza: arrayPizzas, hasHeader: true, isPizzas: true})
});
    // Página Login feita
app.get("/admin/login", (req,res) => res.render('admin/login', {titulo: "Login | Administração | "}));
app.post("/admin/login", async (req,res) => {
    const form = {usuario, senha} = req.body;
    var sucesso = checkForm(form);
    if (sucesso) {
        try {
            const criptoSenha = criptografar(senha);
            const hasUser = await consulta("SELECT * FROM usuarios WHERE usuario = ? AND senha = ?", [usuario, criptoSenha]);
            if (hasUser.length > 0) {
                const token = uuidv4();
                const isOk = await consulta("UPDATE usuarios SET token = ? WHERE id = ?", [token, hasUser[0].id]);
                res.cookie("token", token);
                req.session.usuario = hasUser[0]

                // Final: redireciona para o index do nível admin
                res.redirect('/admin/');
                return;
            } else sucesso = false;
        } catch (error) {
            sucesso = false;
            console.error(error);
        }
    } else console.error("ERRO BAD_REQUEST: pelo menos uma informação do formulário não foi preenchida corretamente.");

    res.render('admin/login', {titulo: "Login | Administração | ", isPost: true, hasSuccess: sucesso});
});
    // Requerimento de Logout feito
app.get("/admin/logout", (req,res) => {
    res.cookie("token", "");
    req.session.destroy();
    res.redirect("/admin/login");
});
    // Página Mensagens feita
app.get("/admin/mensagens", async (req,res) => {
    if (checkSession(req,res)) return;
    if (req.query.deletar != '' && req.query.deletar != null) {
        try {
            const sql = "DELETE FROM mensagens WHERE id = ?";
            await consulta(sql, req.query.deletar);
        } catch (error) {
            console.error(error);
        }
    }
    var arrayMensagerns = []
    try {
        arrayMensagerns = await consulta("SELECT * FROM mensagens");
    } catch (error) {
        console.error(error);
    } finally {
        res.render('admin/mensagens', {titulo: "Mensagens | Administração | ", mensagem: arrayMensagerns, hasHeader: true, isMensagens: true})
    }
});
    // Página Usuários feita
app.get("/admin/usuarios", async (req,res) => {
    if (checkSession(req,res)) return;
    if (req.query.deletar != '' && req.query.deletar != null) {
        try {
            const sql = "DELETE FROM usuarios WHERE id = ?";
            await consulta(sql, req.query.deletar);
        } catch (error) {
            console.error();
        }        
    }
    var arrayUsuarios = null;
    try {
        arrayUsuarios = await consulta("SELECT * FROM usuarios");
    } catch (error) {
        console.error(error);
    } finally {
        res.render('admin/usuarios', {titulo: "Usuários | Administração | ", usuario: arrayUsuarios, hasHeader: true, isUsuarios: true})
    }
});
//#endregion

//#region Funções utilitárias
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});
// Verificação de erro
function checkForm(form) {
    // Erros: valores zerados ou negativos, strings vazia, nomes com apenas uma ou duas letra e assim por diante
    for (var prop in form) {
        if (form[prop] == '') return false;
        var len = (String)(form[prop]).length;
        if (['descricao', 'nomeCompleto', 'nome', 'email', 'assunto', 'nomePizza', 'foto', 'senha', 'confirmacaoSenha', 'usuario'].includes(prop) && (len <= 2)) return false;
        if (['precoBrotinho', 'precoMedia', 'precoGrande'].includes(prop) && (form[prop] == NaN || form[prop] <= 0)) return false;
    }
    return true;
}
// Criptografia
const crypto = require('crypto');
function criptografar(senha) {
    const chave = "pizzadeveloper16pizzadeveloper32";
    const arrayIni = '4329784383';
    const cifra = crypto.createCipheriv('aes-256-gcm', chave, arrayIni);
    var criptoSenha = cifra.update(senha);
    criptoSenha = Buffer.concat([criptoSenha, cifra.final()]);
    
    return criptoSenha.toString('hex');
}
function descriptografar(criptoSenha) {
    const chave = "pizzadeveloper16pizzadeveloper32";
    const arrayIni = '4329784383';
    const decifra = crypto.createDecipheriv('aes-256-gcm', chave, arrayIni);
    var senha = decifra.update(Buffer.from(criptoSenha, 'hex'));
    senha = Buffer.concat([senha]);
    
    return senha.toString();
}
//#endregion