var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', function(req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'its@net2012',
        server: 'sistemnet.zapto.org',
        database: 'ITSNET'
    };

    // connect to your database
    sql.connect(config, function(err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query("SELECT fun.[ID_FUNCIONARIO] as iduser,fun.[NOME] as name, fun.[CPF] as cpf,case when cargo.DESCRICAO like '%INSTALADOR%' then 'GERAL'else    'MONITOR'end as role, UPPER(mun.DESCRICAO) as city,  case  when fun.Data_demissao IS NULL then 1 else 0 end as active FROM [ITSNET].[dbo].[tbl_FUNCIONARIOS] as fun left join [ITSNET].[dbo].[TBL_FUNCAO] as cargo on fun.ID_FUNCAO=cargo.ID_FUNCAO join [ITSNET].[dbo].[TBL_ENDERECO_EMPRESA] as cidade on fun.EMPRESA=cidade.ID_EMPRESA join tbl_MUNICIPIOS as mun on cidade.MUNICIPIO=mun.COD_MUNICIPIO ORDER BY fun.[NOME] ASC", function(err, recordset) {

            if (err) console.log(err);

            res.json(recordset);


        });
    });
});
app.get('/veiculos', function(req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'its@net2012',
        server: 'sistemnet.zapto.org',
        database: 'ITSNET'
    };

    // connect to your database
    sql.connect(config, function(err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query("SELECT  ID_VEICULO, PLACA ,MODELO FROM dbo.tbl_VEICULOS WHERE ATIVO =1 AND SYNCHRO=1 ORDER BY PLACA ASC;", function(err, recordset) {

            if (err) console.log(err)

            // send records as a response
            //console.log(recordset);
            var dados = {};
            for (var i = 0; i < recordset.lenght; i++) {
                dados.push({
                    ID_VEICULO: recordset[i].ID_VEICULO
                });
            }
            res.send(recordset);
            console.log(dados.ID_VEICULO);


        });
    });
});

var port = process.env.PORT || 3800;
var server = app.listen(port, function() {
    console.log('Server is running...  ' + port);
});