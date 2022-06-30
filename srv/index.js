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
  Ppr.Tipo_Operacao,
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
  Ppr.Tipo_Operacao,
  Ppr.Numero_Proposta,
  Ppr.Vendedor,
  Ppr.Tipo_Carga,
  Ppr.SituacaoProposta,
  Ppr.Tipo_modalidade
From
  vis_Painel_Proposta Ppr WHERE Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} ORDER BY IdOferta_Frete DESC`;
 }

console.log(sql)
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


function dataAtualFormatada(){
  var data = new Date(),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return anoF+"-"+mesF+"-"+diaF;
}

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


app.get('/filtro_propostas', (req, res) => {
  var tipo = req.query.tipo;
  var periodo = req.query.periodo;
  var vendedor = req.query.vendedor;
  if(tipo == 'Todas'){
    var where = `WHERE Ppr.IdOferta_Frete IS NOT NULL`;
  }else{
    var where = `WHERE Ppr.SituacaoProposta = '${tipo}'`;
  }

  console.log(tipo)
  
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'numeric' });
  const day = date.toLocaleString('default', { day: 'numeric' });
  console.log('dia', day)

  // if(req.query.cliente != ''){
  //   where = '';
  // }

  if(req.query.proposta != ''){
    where += ` AND Ppr.Numero_Proposta LIKE '%${req.query.proposta}%'`;
  }
  if(req.query.cliente != ''){
    where += ` AND Ppr.Cliente LIKE '%${req.query.cliente}%'`;
  }

  if(req.query.vendedor != 'todos'){
    where += ` AND Ppr.IdVendedor = ${vendedor}`;
  }

  if(req.query.periodo == 'hoje'){
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = 2022 AND Datepart(DAY, Ppr.Data_abertura_convertido) = ${day}`;
  }else if(req.query.periodo == 'ontem'){
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = 2022 AND Datepart(DAY, Ppr.Data_abertura_convertido) = ${day-1}`;
  }else if(req.query.periodo == 'esta_semana'){

    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = 2022 AND Case When (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) = 0 Then 52 else (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) End = ${weekInYear}`;
  }else if(req.query.periodo == 'semana_passada'){
    console.log('esta semana')
    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${month} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = 2022 AND Case When (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) = 0 Then 52 else (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) End = ${weekInYear-1}`;
  }else if(req.query.periodo == 'todas'){
  
  }else{
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${periodo} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = 2022`;
  }

  

  

  console.log(req.query)

  

  var sql = `Select
  Ppr.Data_abertura_convertido,
  Datepart(MONTH, Ppr.Data_abertura_convertido) as MesAbertura,
  Ppr.IdOferta_Frete,
  Ppr.Tipo_Operacao,
  Ppr.IdVendedor,
  Ppr.Cliente,
  Ppr.Numero_Proposta,
  Ppr.Vendedor,
  Ppr.Tipo_Carga,
  Ppr.SituacaoProposta,
  Ppr.Tipo_modalidade
From
  vis_Painel_Proposta Ppr ${where} ORDER BY IdOferta_Frete DESC`;

console.log(sql)







  global.conn.request()
  .query(sql)
  .then(result3 => {

    res.json(result3.recordset)
  })

})


app.get('/ultimas_propostas', (req, res) => {

  var sql = `Select TOP 5
  Ppr.Data_abertura_convertido,
  Datepart(MONTH, Ppr.Data_abertura_convertido) as MesAbertura,
  Ppr.IdOferta_Frete,
  Ppr.Tipo_Operacao,
  Ppr.IdVendedor,
  Ppr.Cliente,
  Ppr.Numero_Proposta,
  Ppr.Vendedor,
  Ppr.Tipo_Carga,
  Ppr.SituacaoProposta,
  Ppr.Tipo_modalidade
From
  vis_Painel_Proposta Ppr ORDER BY IdOferta_Frete DESC`;


  global.conn.request()
  .query(sql)
  .then(result3 => {

    res.json(result3.recordset)
  })

})



app.get('/ultimas_mov_financeiras', (req, res) => {



  var sql = `Select top 5
  Mfn.IdMovimentacao_Financeira,
  Pss.Nome as Pessoa,
  Mfn.Data_Conciliacao,
  Convert(varchar, Mfn.Data_Conciliacao, 23) as Data_Conciliacao_Convertido,
  case 
    when Mfn.IdTipo_Transacao in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Mfn.Referencia is null Then 'Administrativo'
    When Mfn.IdTipo_Transacao not in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Mfn.Referencia is null Then 'Baixa unificada' 
    Else Mfn.Referencia end as Referencia,
  Mfn.Natureza,
  Mdd.Sigla,
  Mfn.Valor_Original,
  Rcn.Nome as ResponsavelConciliacao,
  Ttr.Nome as TipoTransacao,
  Ccr.Nome as ContaCorrente
From
  mov_Movimentacao_Financeira Mfn
Left Outer Join
  cad_Pessoa Pss on Pss.IdPessoa = Mfn.IdPessoa
Left Outer Join
  cad_Tipo_Transacao Ttr on Ttr.IdTipo_Transacao = Mfn.IdTipo_Transacao
Left Outer Join
  cad_Pessoa Rcn on Rcn.IdPessoa = Mfn.IdResponsavel_Conciliacao
Left Outer Join
  cad_Moeda Mdd on Mdd.IdMoeda = Mfn.IdMoeda
Left Outer Join
  cad_Conta_Corrente Ccr on Ccr.IdConta_Corrente = Mfn.IdConta_Corrente
 
Order by
  Mfn.IdMovimentacao_Financeira desc`;


  global.conn.request()
  .query(sql)
  .then(result3 => {

    res.json(result3.recordset)
  })

})


app.get('/listagem_faturas', (req, res) => {

  
  var tipo = req.query.tipo;
  var periodo = req.query.periodo;
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'numeric' });
  const day = date.toLocaleString('default', { day: 'numeric' });
  const year = date.toLocaleString('default', { year: 'numeric' });

  if(tipo == 'Todas'){
    var where = `WHERE Mfn.IdMovimentacao_Financeira IS NOT NULL`;
  }else{
    var where = `WHERE Mfn.Natureza = '${tipo}'`;
  }

  if(req.query.pessoa != '' && req.query.pessoa){
    where += ` AND Pessoa LIKE '%${req.query.pessoa}%'`;
  }

  if(req.query.referencia != '' && req.query.referencia){
    where += ` AND FiltroReferencia LIKE '%${req.query.referencia}%'`;
  }


  if(req.query.periodo == 'hoje'){
    where += ` AND Datepart(MONTH, Mfn.Data_Conciliacao) = ${month} AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Datepart(DAY, Mfn.Data_Conciliacao) = ${day}`;
  }else if(req.query.periodo == 'ontem'){
    where += ` AND Datepart(MONTH, Mfn.Data_Conciliacao) = ${month} AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Datepart(DAY, Mfn.Data_Conciliacao) = ${day-1}`;
  }else if(req.query.periodo == 'esta_semana'){

    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(MONTH, Mfn.Data_Conciliacao) = ${month} AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Case When (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) = 0 Then 52 else (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) End = ${weekInYear}`;
  }else if(req.query.periodo == 'semana_passada'){
    console.log('esta semana')
    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(MONTH, Mfn.Data_Conciliacao) = ${month} AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Case When (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) = 0 Then 52 else (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) End = ${weekInYear-1}`;
  }else if(req.query.periodo == 'todas'){
  
  }else{
    where += ` AND Datepart(MONTH, Mfn.Data_Conciliacao) = ${periodo} AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year}`;
  }


  var sql = `Select
  *
From (
Select
  Mfn.IdMovimentacao_Financeira,
  Pss.Nome as Pessoa,
  Mfn.Data_Conciliacao,
  Convert(varchar, Mfn.Data_Conciliacao, 23) as Data_Conciliacao_Convertido,
  case
    when Mfn.IdTipo_Transacao in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Mfn.Referencia is null Then 'Administrativo'
    When Mfn.IdTipo_Transacao not in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Mfn.Referencia is null Then 'Baixa unificada'
    Else Mfn.Referencia end as Referencia,
  Mfn.Natureza,
  Mdd.Sigla,
  Mfn.Valor_Original,
  Rcn.Nome as ResponsavelConciliacao,
  Ttr.Nome as TipoTransacao,
  Ccr.Nome as ContaCorrente,
  Case
    When STUFF((SELECT '/ ' + Rfn.Referencia
            From
                mov_Movimentacao_Financeira_Categoria Mfc
            Left Outer Join
                mov_Fatura_Financeira_Categoria Ffc on Ffc.IdFatura_Financeira_Categoria = Mfc.IdFatura_Financeira_Categoria
            Left Outer Join
                mov_Fatura_Financeira Ffn on Ffn.IdFatura_Financeira = Ffc.IdFatura_Financeira
            Left Outer Join
                mov_Registro_Financeiro Rfn on Rfn.IdRegistro_Financeiro = Ffn.IdRegistro_Financeiro
            Where
              Mfc.IdMovimentacao_Financeira = Mfn.IdMovimentacao_Financeira FOR XML PATH ('')), 1, 1, '') is null Then 'Administrativo'
    Else STUFF((SELECT '/ ' + Rfn.Referencia
            From
                mov_Movimentacao_Financeira_Categoria Mfc
            Left Outer Join
                mov_Fatura_Financeira_Categoria Ffc on Ffc.IdFatura_Financeira_Categoria = Mfc.IdFatura_Financeira_Categoria
            Left Outer Join
                mov_Fatura_Financeira Ffn on Ffn.IdFatura_Financeira = Ffc.IdFatura_Financeira
            Left Outer Join
                mov_Registro_Financeiro Rfn on Rfn.IdRegistro_Financeiro = Ffn.IdRegistro_Financeiro
            Where
              Mfc.IdMovimentacao_Financeira = Mfn.IdMovimentacao_Financeira FOR XML PATH ('')), 1, 1, '') end as FiltroReferencia
From
  mov_Movimentacao_Financeira Mfn
Left Outer Join
  cad_Pessoa Pss on Pss.IdPessoa = Mfn.IdPessoa
Left Outer Join
  cad_Tipo_Transacao Ttr on Ttr.IdTipo_Transacao = Mfn.IdTipo_Transacao
Left Outer Join
  cad_Pessoa Rcn on Rcn.IdPessoa = Mfn.IdResponsavel_Conciliacao
Left Outer Join
  cad_Moeda Mdd on Mdd.IdMoeda = Mfn.IdMoeda
Left Outer Join
  cad_Conta_Corrente Ccr on Ccr.IdConta_Corrente = Mfn.IdConta_Corrente) Mfn
  ${where}
Order by
  Mfn.IdMovimentacao_Financeira desc`;

 console.log(sql)


  global.conn.request()
  .query(sql)
  .then(result3 => {

    res.json(result3.recordset)
  })

})









server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});