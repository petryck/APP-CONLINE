import mysql from 'mysql'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
// import tedious from 'tedious'
import sql from 'mssql'

const app = express()
const server = http.Server(app);

console.clear()
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

var dbMetasMensal = {}
var dbMetasAnualFinanceiro = {}

var loader;
var inicio_timer;
var fim_timer;
var total_time;
function loading(){
  inicio_timer = performance.now();
  const P = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'];
  let x = 0;
  loader = setInterval(() => {
    process.stdout.write(`\r${P[x++]} `);
    x %= P.length;
  }, 150);
}






function stopLoading(){
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  clearInterval(loader);
  fim_timer = performance.now();
  var calcula_tempo = (fim_timer - inicio_timer)/1000;
  
  total_time = '⏰ '+calcula_tempo.toFixed(2)+'s'
}


const port = 6888

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

loading()
sql.connect(connStr).then(conn => {
  global.conn = conn
  stopLoading()
  console.log('🤖 CONECTADO A DB --> HEADCARGO '+ total_time)
  PQuery();

}).catch(err => console.log(err));


  var connection = mysql.createConnection({
    host: "144.22.225.253",
    user: "aplicacao",
    port: "3306",
    password: "conline@2510A",
    database: "SIRIUS",
    charset: "utf8mb4"
  });

  // loading() 
  connection.connect(function(err) {
  
  
    if(err){
      stopLoading()
      console.log('🤖 ERRO AO ACESSAR DB --> MYSQL'+ total_time)
    
    }else{
      stopLoading()
        console.log('🤖 CONECTADO A DB --> MYSQL'+ total_time)
        // PQuery()
       
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


  
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'numeric' });
  const day = date.toLocaleString('default', { day: 'numeric' });
  const year = date.toLocaleString('default', { year: 'numeric' });

  //DATAS
  var hoje = date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

  var ontem = date.setDate(date.getDate() - 1);
  var ontem = new Date(ontem);
      ontem = ontem.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

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
  ('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
  if(req.query.periodo == 'hoje'){
    where += ` AND Ppr.Data_abertura_convertido = '${hoje}' `;
  }else if(req.query.periodo == 'ontem'){
    
    where += ` AND Ppr.Data_abertura_convertido = '${ontem}' `;
  }else if(req.query.periodo == 'esta_semana'){

    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(YEAR, Ppr.Data_abertura_convertido) = ${year} AND Case When (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) = 0 Then 52 else (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) End = ${weekInYear-1}`;
  }else if(req.query.periodo == 'semana_passada'){
    console.log('esta semana')
    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(YEAR, Ppr.Data_abertura_convertido) = ${year} AND Case When (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) = 0 Then 52 else (Datepart(WEEK, Ppr.Data_abertura_convertido) - 1) End = ${weekInYear-2}`;
  }else if(req.query.periodo == 'todas'){
  
  }else{
    where += ` AND Datepart(MONTH, Ppr.Data_abertura_convertido) = ${periodo} AND Datepart(YEAR, Ppr.Data_abertura_convertido) = ${year}`;
  }


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

app.get('/info_mov_financeira_new', (req, res) => {
  var referencia = req.query.referencia;

    var sql = `Select * FROM ( SELECT
      Rfn.IdRegistro_Financeiro,
      Rfn.Data,
      Convert(varchar, Rfn.Data, 23) as DataConvertido,
      Pss.Nome as Pessoa,
      Rfn.Situacao, /*1-Em aberto // 2-Finalizado // 3-Cancelado // 4-Parcialmente quitado*/
      Rfn.Historico_Resumo,
      case
        when Rfn.IdTipo_Transacao in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Rfn.Referencia is null Then 'Administrativo'
        When Rfn.IdTipo_Transacao not in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Rfn.Referencia is null Then 'Baixa unificada'
        Else Rfn.Referencia
      end as Referencia,
      Ccr.Nome as ContaCorrente,
      Ttr.Nome as tipoTransacao,
      Ffn.Data_Pagamento,
      Convert(varchar, Ffn.Data_Pagamento, 23) as DataPagamento,
      Rfn.Natureza, /*0-Pagamento // 1-Recebimento*/
      Mdo.Sigla as Moeda,
      Rfn.Valor_Original
    From
      mov_Registro_Financeiro Rfn
    Left Outer Join 
      cad_Tipo_Transacao Ttr on Ttr.IdTipo_Transacao = Rfn.IdTipo_Transacao
    Left Outer Join
      mov_Fatura_Financeira Ffn on Ffn.IdRegistro_Financeiro = Rfn.IdRegistro_Financeiro
    Left Outer Join
      cad_Moeda Mdo on Mdo.IdMoeda = Rfn.IdMoeda
    Left Outer Join
      cad_Pessoa Pss on Pss.IdPessoa = Rfn.IdPessoa
    Left Outer Join
      cad_Conta_Corrente Ccr on Ccr.IdConta_Corrente = Rfn.IdConta_Corrente
      ) Rfn
      WHERE Rfn.IdRegistro_Financeiro = ${referencia}`;

      global.conn.request()
      .query(sql)
      .then(result3 => {
        res.json(result3.recordset[0])
      })


})
app.get('/info_mov_financeira', (req, res) => {
  var referencia = req.query.referencia;
  var saida = {};
  var sql = `Select top 30
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
  WHERE Mfn.IdMovimentacao_Financeira = ${referencia}`;


  global.conn.request()
  .query(sql)
  .then(result3 => {
    
    


var sql = `Select
            Mfc.IdMovimentacao_Financeira,
            Mfc.Natureza /*0-Pagamento // 1-Recebimento*/,
            Moe.Sigla as Moeda,
            Mfc.Valor_Convertido,
            Cfn.Nome as Categoria_Financeira,
            Case
              When Rfn.Referencia is null Then 'Administrativa'
              Else Rfn.Referencia
            End as Referencia_Fatura
            From
            mov_Movimentacao_Financeira_Categoria Mfc
            Left Outer Join
            cad_Categoria_Financeira Cfn on Cfn.IdCategoria_Financeira = Mfc.IdCategoria_Financeira
            Left Outer Join
            mov_Fatura_Financeira_Categoria Ffc on Ffc.IdFatura_Financeira_Categoria = Mfc.IdFatura_Financeira_Categoria
            Left Outer Join
            mov_Fatura_Financeira Ffn on Ffn.IdFatura_Financeira = Ffc.IdFatura_Financeira
            Left Outer Join
            mov_Registro_Financeiro Rfn on Rfn.IdRegistro_Financeiro = Ffn.IdRegistro_Financeiro
            Left Outer Join
            mov_Movimentacao_Financeira Mfn on Mfn.IdMovimentacao_Financeira = Mfc.IdMovimentacao_Financeira
            Left Outer Join
            cad_Moeda Moe on Moe.IdMoeda = Mfn.IdMoeda
            WHERE Mfc.IdMovimentacao_Financeira = ${referencia}`;
      
            global.conn.request()
            .query(sql)
            .then(result4 => {
              saida['infos'] = result3.recordset[0]
              saida['faturas'] = result4.recordset

              res.json(saida)
            })


    
  })

})



app.get('/mov_financeira_pendente', (req, res) => {

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'numeric' });
  const day = date.toLocaleString('default', { day: 'numeric' });
  const year = date.toLocaleString('default', { year: 'numeric' });




  if(req.query.tipo == '1'){
  var where = `WHERE Rfn.Situacao NOT IN (2,3)`;
  }else{
  var where = `WHERE Rfn.IdRegistro_Financeiro IS NOT NULL`;
  }
  
  if(req.query.pessoa != '' && req.query.pessoa){
    where += ` AND Pessoa LIKE '%${req.query.pessoa}%'`;
  }

  if(req.query.referencia != '' && req.query.referencia){
    where += ` AND Referencia LIKE '%${req.query.referencia}%'`;
  }

  if(req.query.quantidade == 'tudo'){
   var top = ``;
  }else{
    var top = `TOP ${req.query.quantidade}`;
  }


  


  var sql = `Select ${top} * FROM ( SELECT
    Rfn.IdRegistro_Financeiro,
    Rfn.Data,
    Convert(varchar, Rfn.Data, 23) as DataConvertido,
    Pss.Nome as Pessoa,
    Rfn.Situacao, /*1-Em aberto // 2-Finalizado // 3-Cancelado // 4-Parcialmente quitado*/
    Rfn.Historico_Resumo,
    case
      when Rfn.IdTipo_Transacao in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Rfn.Referencia is null Then 'Administrativo'
      When Rfn.IdTipo_Transacao not in (23,30,32,33,34,36,37,39,41,42,43,44,45) and Rfn.Referencia is null Then 'Baixa unificada'
      Else Rfn.Referencia
    end as Referencia,
    Ccr.Nome as ContaCorrente,
    Ttr.Nome as tipoTransacao,
    Ffn.Data_Pagamento,
    Convert(varchar, Ffn.Data_Pagamento, 23) as DataPagamento,
    Rfn.Natureza, /*0-Pagamento // 1-Recebimento*/
    Mdo.Sigla as Moeda,
    Rfn.Valor_Original
  From
    mov_Registro_Financeiro Rfn
  Left Outer Join
    cad_Tipo_Transacao Ttr on Ttr.IdTipo_Transacao = Rfn.IdTipo_Transacao
  Left Outer Join
    mov_Fatura_Financeira Ffn on Ffn.IdRegistro_Financeiro = Rfn.IdRegistro_Financeiro
  Left Outer Join
    cad_Moeda Mdo on Mdo.IdMoeda = Rfn.IdMoeda
  Left Outer Join
    cad_Pessoa Pss on Pss.IdPessoa = Rfn.IdPessoa
  Left Outer Join
    cad_Conta_Corrente Ccr on Ccr.IdConta_Corrente = Rfn.IdConta_Corrente
    ) Rfn
    ${where}
    Order by
    Rfn.IdRegistro_Financeiro desc`;

    


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



    //DATAS
    var hoje = date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

    var ontem = date.setDate(date.getDate() - 1);
    var ontem = new Date(ontem);
        ontem = ontem.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

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
    where += ` AND Mfn.Data_Conciliacao = '${hoje}'`;
  }else if(req.query.periodo == 'ontem'){
    where += ` AND Mfn.Data_Conciliacao = ${ontem}`;
  }else if(req.query.periodo == 'esta_semana'){

    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += ` AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Case When (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) = 0 Then 52 else (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) End = ${weekInYear-1}`;
  }else if(req.query.periodo == 'semana_passada'){
    console.log('esta semana')
    let splitedDate = dataAtualFormatada().split("-")
    let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
    let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
    let yearDay = ((dateObj - firstDayYear) / 86400000)+1
    let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
    
    where += `  AND Datepart(YEAR, Mfn.Data_Conciliacao) = ${year} AND Case When (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) = 0 Then 52 else (Datepart(WEEK, Mfn.Data_Conciliacao) - 1) End = ${weekInYear-2}`;
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




  global.conn.request()
  .query(sql)
  .then(result3 => {

    res.json(result3.recordset)
  })

})




function META_GERAL_ANUAL(){
  return new Promise((resolve,reject)=>{
      //here our function should be implemented 
      var sql = `SELECT * FROM vis_Metas_Financeiro_Anual_ITJ`;

        global.conn.request()
        .query(sql)
        .then(result3 => {

          mtas_geral_anual['itj'] = result3.recordset;

          var sql = `SELECT * FROM vis_Metas_Financeiro_Anual_NH`;

        global.conn.request()
          .query(sql)
          .then(result4 => {
        
            stopLoading()
            mtas_geral_anual['nh'] = result4.recordset;
            
            console.log('✔️  METAS GERAL ANUAL! '+ total_time)
            resolve();
          
            
          })

        })
  });
}

function METAS_MENSAL(){
  return new Promise((resolve,reject)=>{

    var sql = `SELECT * FROM vis_Metas_Mensal_ITJ`;

    global.conn.request()
    .query(sql)
    .then(result3 => {
  
      var teste = result3.recordset;
      dbMetasMensal['itj'] = teste
  
      var sql = `SELECT * FROM vis_Metas_Mensal_ITJ`;
          global.conn.request()
          .query(sql)
          .then(result4 => {
            stopLoading()
            var teste = result4.recordset;
            dbMetasMensal['nh'] = teste
            
            console.log('✔️  METAS MENSAIS! '+total_time)
            resolve();
            
          })
      
    })
  });
}


function METAS_ANUAIS_FINANCEIRO(){
  return new Promise((resolve,reject)=>{

    var sql = `SELECT * FROM vis_Metas_Financeiro_Mensal_ITJ`;

    global.conn.request()
    .query(sql)
    .then(result3 => {
  
      var teste = result3.recordset;
      dbMetasAnualFinanceiro['itj'] = teste
  
      var sql = `SELECT * FROM vis_Metas_Financeiro_Mensal_ITJ`;
          global.conn.request()
          .query(sql)
          .then(result4 => {
            stopLoading()
            var teste = result4.recordset;
            dbMetasAnualFinanceiro['nh'] = teste
            
            console.log('✔️  METAS ANUAIS FINANCEIRO! '+ total_time)
            resolve();
            
          })
      
    })
  });
}


// function PQuery(){
//   setTimeout(() => {
//     metas_geral_anual('itj')
//     // metas_mensal('nh')
//   }, 1000);

//   setTimeout(() => {
//     metas_mensal('itj')
//     // metas_mensal('nh')
//   }, 5000);

//   setTimeout(() => {
//     metas_anual_financeiro('itj')
//     // metas_mensal('nh')
//   }, 10000);


// }






app.get('/meta_anual_financeira', (req, res) => {

  var filial = req.query.filial


  res.json(dbMetasAnualFinanceiro[filial])
  
  })

app.get('/meta_mensal', (req, res) => {


var filial = req.query.filial

res.json(dbMetasMensal[filial])

})
var mtas_geral_anual = {};


// function metas_geral_anual(filial){

 

//     var sql = `SELECT * FROM vis_Metas_Financeiro_Anual_ITJ`;

//   global.conn.request()
//   .query(sql)
//   .then(result3 => {


//     mtas_geral_anual['itj'] = result3.recordset;


//     var sql = `SELECT * FROM vis_Metas_Financeiro_Anual_NH`;

//     global.conn.request()
//     .query(sql)
//     .then(result4 => {
  
  
//       mtas_geral_anual['nh'] = result4.recordset;
//       stopLoading()
//       console.log('metas geral anual carregada')
      
//     })




    
//   })
// }


app.get('/meta_anual_hoje', (req, res) => {


  res.json(mtas_geral_anual)

  
  })

  app.get('/Metas_diario', (req, res) => {

    // const d = new Date();
    // var day = DataHoje.getDay();
    // console.log(day)

    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

        if(req.query.filial == 'itj'){

          global.conn.request()
          .query(`SELECT * FROM vis_Metas_Diaria_ITJ WHERE Dia_Abertura = ${day} AND Mes_Abertura = ${month} AND Ano_Abertura = ${year}`)
          .then(result => {
      
            res.json(result.recordset[0])
          })
          .catch(err => {
            console.log(err)
            return err;
          });

        }else if(req.query.filial == 'nh'){

          global.conn.request()
          .query(`SELECT * FROM vis_Metas_Diaria_NH WHERE Dia_Abertura = ${day} AND Mes_Abertura = ${month} AND Ano_Abertura = ${year}`)
          .then(result => {
      
            res.json(result.recordset[0])
          })
          .catch(err => {
            console.log(err)
            return err;
          });
        }
   

  

  })


  app.get('/Metas_semanal', (req, res) => {
    var date = new Date();
    var month = date.toLocaleString('default', { month: 'numeric' });
    var day = date.toLocaleString('default', { day: 'numeric' });
    var year = date.toLocaleString('default', { year: 'numeric' });

      let splitedDate = dataAtualFormatada().split("-")
      let dateObj = new Date(+splitedDate[0], +splitedDate[1]-1, +splitedDate[2], 0,0,0,0 )
      let firstDayYear = new Date(+splitedDate[0],0,1,0,0,0,0 )
      let yearDay = ((dateObj - firstDayYear) / 86400000)+1
      let weekInYear = +(String((yearDay + firstDayYear.getDay()+1) / 7).split(".")[0])
   


    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

        if(req.query.filial == 'itj'){

          global.conn.request()
          .query(`SELECT * FROM vis_Metas_Semanal_ITJ WHERE Semana_Abertura = ${weekInYear} AND Ano_Abertura = ${year}`)
          .then(result => {
        
            res.json(result.recordset[0])
          })
          .catch(err => {
            console.log(err)
            return err;
          });

        }else if(req.query.filial == 'nh'){

          global.conn.request()
          .query(`SELECT * FROM vis_Metas_Semanal_NH WHERE Semana_Abertura = ${weekInYear} AND Ano_Abertura = ${year}`)
          .then(result => {
        
            res.json(result.recordset[0])
          })
          .catch(err => {
            console.log(err)
            return err;
          });

        }
   

  

  })
 

  async function PQuery(){
   
    console.log("💣 CARREGANDO INFORMAÇÕES, AGUARDE!");
    loading()
    await META_GERAL_ANUAL();
    loading()
    await METAS_MENSAL();
    loading()
    await METAS_ANUAIS_FINANCEIRO();
    
    server.listen(port, function () {
      
      console.log(`🚀 SERVIDOR CARREGADO! \n📍 http://localhost:${server.address().port}`);
      stopLoading()
    });
   
  }
  


