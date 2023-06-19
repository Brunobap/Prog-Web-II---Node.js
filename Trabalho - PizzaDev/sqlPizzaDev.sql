USE heroku_fd37fe06d7b1684;
CREATE TABLE IF NOT EXISTS Pizzas (
	id INT PRIMARY KEY,
    nome VARCHAR(50),
    imgSrc VARCHAR(50),
    ingredientes VARCHAR(100),
    precoPeq DECIMAL(4,2),
    precoMed DECIMAL(4,2),
    precoGrande DECIMAL(4,2)    
);
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    token VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS Mensagens (
	id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    assunto VARCHAR(50) NOT NULL,
    mensagem VARCHAR(500) NOT NULL
);