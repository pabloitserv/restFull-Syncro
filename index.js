
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function( req, res, next ){
  res.header("Acess-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var sql = require('mssql');

var config = {
  server: 'sistemnet.zapto.org',
  database: 'ITSNET',
  user: 'sa',
  password:  'its@net2012'
};

app.get('/login', function( req, res ){
function getEmp(){
  var conn = new sql.Connection(config);
  var req = new sql.Request(conn);

  conn.connect( function ( err ){
    if (err) {
      throw err;
      console.log(err);
      return;
    }

    req.query("SELECT fun.[ID_FUNCIONARIO] as iduser,fun.[NOME] as name, fun.[CPF] as cpf,case when cargo.DESCRICAO like '%INSTALADOR%' then 'GERAL'else    'MONITOR'end as role, UPPER(mun.DESCRICAO) as city,  case  when fun.Data_demissao IS NULL then 1 else 0 end as active FROM [ITSNET].[dbo].[tbl_FUNCIONARIOS] as fun left join [ITSNET].[dbo].[TBL_FUNCAO] as cargo on fun.ID_FUNCAO=cargo.ID_FUNCAO join [ITSNET].[dbo].[TBL_ENDERECO_EMPRESA] as cidade on fun.EMPRESA=cidade.ID_EMPRESA join tbl_MUNICIPIOS as mun on cidade.MUNICIPIO=mun.COD_MUNICIPIO ORDER BY fun.[NOME] ASC", function ( err, recordset ){
      if (err) {

        throw err;
        console.log(err);

      }else{

        console.log(recordset);
        res.json(recordset);

      }
      conn.close();
    });

  });

}
getEmp();

});

app.get('/vehicle', function( req, res ){
function getEmp(){
  var conn = new sql.Connection(config);
  var req = new sql.Request(conn);

  conn.connect( function ( err ){
    if (err) {
      throw err;
      console.log(err);
      return;
    }

    req.query("SELECT  ID_VEICULO, PLACA ,MODELO FROM dbo.tbl_VEICULOS WHERE ATIVO =1 AND SYNCHRO=1 ORDER BY PLACA ASC;", function ( err, recordset ){
      if (err) {

        throw err;
        console.log(err);

      }else{

        console.log(recordset);
        res.json(recordset);

      }
      conn.close();
    });

  });

}
getEmp();

});

app.listen(3001, function(){
  console.log("This service running to port "+ 3001 +", and consume the database ITSNET.");
});
