import mysql from 'mysql'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
import tedious from 'tedious'

const app = express()
const server = http.Server(app);


import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = 6053

var config = {  
    server: 'CONLINE.SQL.HEADCARGO.COM.BR',
    authentication: {
        type: 'default',
        options: {
            userName: 'hc_conline_consulta', //update me
            password: '3C23D35C-84F4-4205-80A2-D59D58A81BEF'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        // encrypt: false,
        rowCollectionOnDone: true,
        "port": 9322,
        database: 'headcargo_conline' ,
    }
  };  
  const CONEXA_HEAD = new tedious.Connection(config)
  
  CONEXA_HEAD.connect(function(err) {
      
    if(err){
        console.log("ERRO AO ACESSAR DB --> SQLSERVER");   
      setTimeout(conecta_sql, 2000);
    }else{
        console.log('CONECTADO DB --> SQLSERVER')
      
    }
  
  }); 

  var connection = mysql.createConnection({
    host: "144.22.225.253",
    user: "aplicacao",
    port: "3306",
    password: "conline@2510A",
    database: "SIRIUS",
    charset: "utf8mb4"
  });
  
  connection.connect(function(err) {
  
  
    if(err){
      console.log('ERRO AO ACESSAR DB --> MYSQL')
    
    }else{
        console.log('CONECTADO DB --> MYSQL')
    }
  
  }); 

app.use('/', express.static(path.join(__dirname, '../public')))


app.get('/login_senha', (req, res) => {
   
    var email = req.query.email;
    var senha = req.query.senha;


  
    var sql = `SELECT * FROM colaboradores WHERE email_sistema = '${email}' AND senha_sistema = '${senha}'`;
    connection.query(sql, function(err2, results){
  
      if(results.length > 0){
        res.json(results);
      }else{
        res.json('error');
      }
  
    })
  
  })



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
})


app.get('/page', (req, res) => {
    var page = req.query.page;
    res.sendFile(path.join(__dirname, '../public/pages/'+page))
})


server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});