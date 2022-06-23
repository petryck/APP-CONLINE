import mysql from 'mysql'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
// import tedious from 'tedious'
import sql from 'mssql'

const app = express()
const server = http.Server(app);


import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = 6053

// var config = {  
//     server: 'CONLINE.SQL.HEADCARGO.COM.BR',
//     authentication: {
//         type: 'default',
//         options: {
//             userName: 'hc_conline_consulta', //update me
//             password: '3C23D35C-84F4-4205-80A2-D59D58A81BEF'  //update me
//         }
//     },
//     options: {
//         // If you are on Microsoft Azure, you need encryption:
//         // encrypt: false,
//         rowCollectionOnDone: true,
//         "port": 9322,
//         database: 'headcargo_conline' ,
//     }
//   };  
//   const CONEXA_HEAD = new tedious.Connection(config)
  
  
//   CONEXA_HEAD.connect(function(err) {
      
//     if(err){
//         console.log("ERRO AO ACESSAR DB --> SQLSERVER");   
//       setTimeout(conecta_sql, 2000);
//     }else{
//         console.log('CONECTADO DB --> SQLSERVER')

//   var request = new tedious.Request("Select Fnc.IdPessoa,Fnc.Nome,Fnc.Foto From vis_Funcionario Fnc Where Fnc.Ativo = 1", function(err, rowCount) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log(rowCount + ' rows');
//           }
//         });

//         request.on('row', function(columns) {
//       columns.forEach(function(column) {
//         console.log(column.value);
//       });
//     });

//         CONEXA_HEAD.execSql(request);
      
//     }
  
//   }); 

const connStr2 = "Server=CONLINE.SQL.HEADCARGO.COM.BR,9322;Database=headcargo_conline;User Id=hc_conline_consulta;Password=3C23D35C-84F4-4205-80A2-D59D58A81BEF;";


const connStr = {
  user: 'hc_conline_consulta',
  password: '3C23D35C-84F4-4205-80A2-D59D58A81BEF',
  database: 'headcargo_conline',
  port:9322,
  server: 'CONLINE.SQL.HEADCARGO.COM.BR',
  pool: {
    max: 99999,
    min: 0,
    idleTimeoutMillis: 90000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

sql.connect(connStr).then(conn => {
  global.conn = conn

}).catch(err => console.log(err));

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


app.get('/lista_vendedores', (req, res) => {
  // var page = req.query.page;

  var sql = `Select
  Fnc.IdPessoa,
  Fnc.Nome,
  Fnc.Foto
From
  vis_Funcionario Fnc
Left Outer Join
  cad_Equipe_Tarefa_Membro Etm on Etm.IdFuncionario = Fnc.IdPessoa
Join
  cad_Equipe_Tarefa Etr on Etr.IdEquipe_Tarefa = Etm.IdEquipe_Tarefa and (Etr.IdEquipe_Tarefa = 62)
Where
  Fnc.Ativo = 1`;
      global.conn.request()
      .query(sql)
      .then(result => {

        res.json(result.recordset)
      })
      .catch(err => {
        console.log(err)
        return err;
      });


})


app.get('/lista_propostas', (req, res) => {
  var attr = req.query.tipo;

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'numeric' });
  


  if(req.query.status){
    var status = req.query.status;
    var where = `WHERE Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} AND SituacaoProposta = '${status}' ORDER BY IdOferta_Frete DESC`;
  }else{
    var where = `WHERE Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} ORDER BY IdOferta_Frete DESC`;
  }

 if(attr == 'mes_atual'){

  var sql = `Select
  Ppr.Data_abertura_convertido,
  Datepart(MONTH, Ppr.Data_abertura_convertido) as MesAbertura,
  Ppr.Cliente,
  Ppr.Numero_Proposta,
  Ppr.Vendedor,
  Ppr.Tipo_Carga,
  Ppr.SituacaoProposta,
  Ppr.Tipo_modalidade,
  Ppr.IdOferta_Frete
From
  vis_Painel_Proposta Ppr ${where}`;

 }else{
  var sql = `Select
  Ppr.Data_abertura_convertido,
  Datepart(MONTH, Ppr.Data_abertura_convertido) as MesAbertura,
  Ppr.IdOferta_Frete,
  Ppr.Cliente,
  Ppr.Numero_Proposta,
  Ppr.Vendedor,
  Ppr.Tipo_Carga,
  Ppr.SituacaoProposta,
  Ppr.Tipo_modalidade
From
  vis_Painel_Proposta Ppr WHERE SituacaoProposta = '${status}' ORDER BY IdOferta_Frete DESC`;
 }


      global.conn.request()
      .query(sql)
      .then(result => {

        res.json(result.recordset)
      })
      .catch(err => {
        console.log(err)
        return err;
      });


})


app.get('/info_proposta', (req, res) => {
  var referencia = req.query.referencia;

  var sql = `Select
                  *
                From
                  vis_App_Proposta WHERE IdOferta_Frete = ${referencia}`;


  global.conn.request()
  .query(sql)
  .then(result => {

    // var saida = array();

    // saida['infos'] = result.recordset[0]

    var sql = `Select
                *
              From
    vis_Painel_Proposta_Equipamento WHERE IdOferta_Frete = ${referencia}`;
    global.conn.request()
  .query(sql)
  .then(result2 => {

   
    // saida['equipamentos'] = result2.recordset[0];

    

    var sql = `Select
                  *
                From
              vis_Painel_Valores_Proposta WHERE IdOferta_Frete = ${referencia}`;

              
              global.conn.request()
              .query(sql)
              .then(result3 => {
            
                var saida = {
                  infos:result.recordset[0],
                  equipamentos: result2.recordset,
                  valores: result3.recordset
                }

                res.json(saida)
              })



  })


    
  })
  .catch(err => {
    console.log(err)
    return err;
  });

})








server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});