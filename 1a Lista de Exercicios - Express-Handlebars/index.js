const { randomInt } = require('crypto');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.engine('hbs', exphbs.engine({  extname:'.hbs'  }));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extends:true}));

// Get para a página principal
app.get('/', (req,res) => res.render('home', {titulo: "Home", isHome: true}))

// Chamadas para as páginas de exercícios
app.get('/ex1', (req,res) => res.render('ex1', {titulo: "Exercício 1"}))
app.post('/ex1/', (req,res) => {
    var num = req.body.num;
    var resultado = "Esse número é ";
    if (num == 0) {resultado += "IGUAL A ZERO"}
    else if (num > 0) {resultado += "POSITIVO"}
    else {resultado += "NEGATIVO"};

    res.render('ex1', {titulo: "Exercício 1", resultado: resultado});
})

app.get("/ex2", (req,res) => {
    var num = req.query.num;
    var resultado = "";
    if (!isNaN(num) && num!=""){
        for (var i=1; i<=10; i++)
            resultado += i+" x "+num+" = "+(i*num)+"<br>";
    }
    res.render('ex2', {titulo: "Exercício 2", resultado: resultado});
})

app.get("/ex3", (req,res) => res.render("ex3", {titulo: "Exercício 3"}));

app.get("/ex4", (req,res) => res.render("ex4", {titulo: "Exercício 4"}));
app.post("/ex4", (req,res) => {
    var altura = req.body.inpAltura, peso = req.body.inpPeso;
    var resultado = calcIMC(peso,altura);
    res.render("ex4", {titulo: "Exercício 4", resultado: resultado})
})
function calcIMC(peso, altura) {
    var pMin = 18.5 * (altura^2);
    var pMax = 24.9 * (altura^2);
    var pMed = (pMin + pMax) / 2;
    var IMC = peso / (altura^2);

    var resultado = "Informações enviadas: "+peso+" kg e "+altura+" m<br>";
    resultado += "Seu peso mínimo: "+pMin;
    resultado += "<br>Seu peso máximo: "+pMax;
    resultado += "<br>Seu peso médio: "+pMed;
    resultado += "<br>Seu IMC: "+IMC+"<br>Resultado: ";
    if (IMC < 18.5) resultado += "Você está abaixo do peso ideal";
    else if (IMC <= 24.9) resultado += "Parabéns – Você está em seu peso normal!";
    else if (IMC <= 29.9) resultado += "Você está acima de seu peso (sobrepeso)";
    else if (IMC <= 34.9) resultado += "Obesidade grau I";
    else if (IMC <= 39.9) resultado += "Obesidade grau II";
    else resultado += "Obesidade grau III";

    return resultado;
}

app.get("/ex5", (req,res) => res.render("ex5", {titulo: "Exercício 5"}));
app.post("/ex5", (req,res) => {
    var n1 = req.body.n1, n2 = req.body.n2, n3 = req.body.n3;
    var media = (1*n1 + 1*n2 + 1*n3)/3;
    var resultado = "Notas informadas (em ordem crescente): "+n1+" - "+n2+" - "+n3;
    resultado += "<br>Média final: "+media;
    if (media >= 6) resultado += "<br>Status: APROVADO";
    else resultado += "<br>Status: REPROVADO";

    res.render("ex5", {titulo: "Exercício 5", resultado: resultado});
});

app.get("/ex6", (req,res) => res.render("ex6", {titulo: "Exercício 6", imgSrc:"assets/images/neutro.png"}));
app.post("/ex6", (req,res) => {
    var etanol = req.body.etanol, gasolina = req.body.gasolina;
    var dados = "Dados inseridos: Etanol = "+etanol+" e Gasolina = "+gasolina;
    var img = "";

    // é mais vantajoso abastecer com etanol se o litro custar até 70% do valor do litro da gasolina.
    if (etanol <= .7*gasolina) img = "assets/images/etanol.png";
    else img = "assets/images/gasolina.png";
    
    if ((isNaN(etanol) || etanol == "") || (isNaN(gasolina) || gasolina == "")) img = "assets/images/neutro.png";

    res.render("ex6", {titulo: "Exercício 6", imgSrc: img, dados: dados});
});

app.get("/ex7", (req,res) => {
    var num = randomInt(1,6);

    var img = "";
    switch (num) {
        case 1:
            img = "assets/images/face1.png";
            break;
            
        case 2:
            img = "assets/images/face2.png";
            break;
            
        case 3:
            img = "assets/images/face3.png";
            break;
            
        case 4:
            img = "assets/images/face4.png";
            break;
            
        case 5:
            img = "assets/images/face5.png";
            break;
            
        case 6:
            img = "assets/images/face6.png";
            break;
    
        default:
            break;
    }

    res.render("ex7", {titulo: "Exercício 6", imgSrc: img, num: num});
});

app.get('/ex8', (req,res) => res.render('ex8', {titulo: "Exercício 8"}));
app.post('/ex8', (req,res) => {
    var nome = req.body.nome, email = req.body.email, cpf = req.body.cpf, idade = req.body.idade;
    var resultado = "Cadastro enviado:<br>";
    resultado += "Nome: "+nome+"<br>Email: "+email;
    resultado += "<br>CPF: "+cpf+"<br>Idade: "+idade;
    res.render('ex8', {titulo: "Exercício 8", resultado: resultado});
});

app.get('/ex9', (req,res) => res.render('ex9', {titulo: "Exercício 9"}));
app.post("/ex9", (req,res) => {
    var resultado = "Números digitados: ";
    var array = [req.body.v1, req.body.v2, req.body.v3, req.body.v4, req.body.v5, req.body.v6, req.body.v7, req.body.v8, req.body.v9, req.body.v10];
    
    var negativos = 0, positivos = 0, pares = 0, impares = 0;
    for (var num of array){
        resultado += num+" / ";
        if (num < 0) negativos++;
        else if (num > 0) positivos++;

        if (num % 2 == 0) pares++;
        else impares++;
    }

    resultado += "<br>"+negativos+" são negativos<br>"+positivos+" são positivos<br>";
    resultado += pares+" são pares<br>"+impares+" são impares";
    res.render('ex9', {titulo: "Exercício 9", resultado: resultado});
});

app.get('/ex10', (req,res) => res.render('ex10', {titulo: "Exercício 10"}));
app.post("/ex10", (req,res) => {
    var resultado = "Números digitados: ";
    var array = [req.body.v1, req.body.v2, req.body.v3, req.body.v4, req.body.v5, req.body.v6, req.body.v7, req.body.v8, req.body.v9, req.body.v10];
   
    for (var num of array) resultado += num+" / ";
    resultado += "<br>Ordem inversa: ";

    for (var i=0; i<10; i++) {
        resultado += array.pop()+" / ";
    }
    
    res.render('ex10', {titulo: "Exercício 10", resultado: resultado});
});

app.get('/ex11', (req,res) => res.render('ex11', {titulo: "Exercício 11", pessoa:[1,2,3,4,5,6,7,8,9,10]}));
app.post('/ex11', (req,res) => {
    var p1 = [req.body.np1, req.body.cp1, req.body.ip1, req.body.sp1];
    var p2 = [req.body.np2, req.body.cp2, req.body.ip2, req.body.sp2];
    var p3 = [req.body.np3, req.body.cp3, req.body.ip3, req.body.sp3];
    var p4 = [req.body.np4, req.body.cp4, req.body.ip4, req.body.sp4];
    var p5 = [req.body.np5, req.body.cp5, req.body.ip5, req.body.sp5];
    var p6 = [req.body.np6, req.body.cp6, req.body.ip6, req.body.sp6];
    var p7 = [req.body.np7, req.body.cp7, req.body.ip7, req.body.sp7];
    var p8 = [req.body.np8, req.body.cp8, req.body.ip8, req.body.sp8];
    var p9 = [req.body.np9, req.body.cp9, req.body.ip9, req.body.sp9];
    var p10 = [req.body.np10, req.body.cp10, req.body.ip10, req.body.sp10];
    var matrix = [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10];

    var l0 = "Suas entradas:";
    var l1 = "Todos os nomes e idades das pessoas cadastradas:";
    var l2 = "Todos os nomes de quem mora em Santos:";
    var l3 = "Todos os nomes de quem tem mais de 18 anos:";
    var l4 = "Pessoas cadastradas são do sexo masculino:";

    for (var i=0; i<10; i++) {
        l0 += "<br> "+matrix[i][0]+" - "+matrix[i][1]+" - "+matrix[i][2]+" - "+matrix[i][3];
        l1 += "<br> - Nome: "+matrix[i][0]+" / Idade: "+matrix[i][2];
        if (matrix[i][1] == "Santos") l2 += "<br> - Nome: "+matrix[i][0];
        if (matrix[i][2] > 18) l3 += "<br> - Nome: "+matrix[i][0];
        if (matrix[i][3] == "M") l4 += "<br> - Nome: "+matrix[i][0];
    }

    res.render('ex11', {titulo: "Exercício 11", pessoa:[1,2,3,4,5,6,7,8,9,10], lista: [l0, l1, l2, l3, l4]});
});

app.get('/ex12', (req,res) => {
    var seq = calcFibbonaci();
    res.render('ex12', {titulo: "Exercício 12", nums: seq});
});
function calcFibbonaci() {
    var seq = [0,1];

    for (var i=0; i<150; i++) {
        seq.push(1*seq[i] + 1*seq[i+1]);
    }

    return seq;
}

app.get('/ex13', (req,res) => res.render('ex13', {titulo: "Exercício 13"}));
app.post("/ex13", (req,res) => {
    var valor = req.body.valor;
    var resultado = "O número "+valor;

    if (valor > 0) {        
        for (var i=2; i<valor; i++) {
            if (valor % i == 0) {
                resultado += " NÃO É PRIMO";
                res.render('ex13', {titulo: "Exercício 13", resultado: resultado});
                return;
            }
        }        
    } else if (valor < 0) {
        for (var i=-2; i>valor; i--) {
            if (valor % i == 0) {
                resultado += " NÃO É PRIMO";
                res.render('ex13', {titulo: "Exercício 13", resultado: resultado});
                return;
            }
        }
    } else {
        resultado += " É NULO";
        res.render('ex13', {titulo: "Exercício 13", resultado: resultado});
        return;
    }

    resultado += " É PRIMO";
    res.render('ex13', {titulo: "Exercício 13", resultado: resultado});
});

app.get('/ex14', (req,res) => res.render('ex14', {titulo: "Exercício 14"}));
app.post("/ex14", (req,res) => {
    var valor = req.body.valor;
    var resultado = "Mês "+valor+" - "+pegaMes(valor);
    
    res.render('ex14', {titulo: "Exercício 14", resultado: resultado});
});
function pegaMes(valor){
    switch (valor) {
        case '1': return "Janeiro";            
        case '2': return "Fevereiro";
        case '3': return "Março";
        case '4': return "Abril";
        case '5': return "Maio";
        case '6': return "Junho";
        case '7': return "Julho";
        case '8': return "Agosto";
        case '9': return "Setembro";
        case '10': return "Outubro";
        case '11': return "Novembro";
        case '12': return "Dezembro";
    
        default: return "Esse mês não existe";
    }
}

app.get('/ex15', (req,res) => res.render('ex15', {titulo: "Exercício 15"}));
app.post("/ex15", (req,res) => {
    var data = req.body.data;
    var array = data.split("-");

    var resultado = "Recebido: "+data+" - Formatado: ";
    var dia = array[2], mes = pegaMes(array[1]), ano = array[0];

    resultado += dia+" de "+mes+" de "+ano;
    res.render('ex15', {titulo: "Exercício 15", resultado: resultado});
});

app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});