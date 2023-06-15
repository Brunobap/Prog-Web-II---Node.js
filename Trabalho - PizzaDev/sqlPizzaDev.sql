CREATE DATABASE IF NOT EXISTS PizzaDev;
USE pizzadev;

CREATE TABLE IF NOT EXISTS Pizzas (
	id INT PRIMARY KEY,
    nome VARCHAR(50),
    imgSrc VARCHAR(50),
    ingredientes VARCHAR(50),
    precoPeq DECIMAL(4,2),
    precoMed DECIMAL(4,2),
    precoGrande DECIMAL(4,2)
);
SELECT * FROM pizzas;
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    senha VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS Mensagens (
	id INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    assunto VARCHAR(50) NOT NULL,
    mensagem VARCHAR(500) NOT NULL
);