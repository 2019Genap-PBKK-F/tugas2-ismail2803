var express = require('express');
var app = express();
var sql = require('mssql');
const dbconfig = require("./Connection/connect");
// const hostname = '10.199.14.46';
const port = 8030;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

var exec = function(res, query, param, reqType) {
    sql.connect(dbconfig, function(err){
        if(err) {
            res.end('Connection Error\n' + err)
        }
        else {
            var request = new sql.Request()
            if(reqType != 0) {
                param.forEach(function(p)
            {
                request.input(p.name, p.sqltype, p.value);
            });
        }
        request.query(query, function(err, response){
            if(err) {
                console.log('Query Error\n' + err)
            }
            else{
                res.send(response.recordset)
            }
        })
        }
    })
}

app.get("/", function(req, res){
    res.end("hallo");
});

////////////////////
// CRUD MAHASISWA //
////////////////////

app.get("/api/mahasiswa", function(req, res){
    var query = "select * from Mahasiswa";
    exec(res, query, null, 0);
});

app.post("/api/mahasiswa", function(req, res){
    var param = [
        { name: 'NRP', sqltype: sql.VarChar, value: req.body.NRP },
        { name: 'Nama', sqltype: sql.VarChar, value: req.body.Nama },
        { name: 'Angkatan', sqltype: sql.Int, value: req.body.Angkatan },
        { name: 'Tgl_lahir', sqltype: sql.Date, value: req.body.Tgl_lahir }
    ]
    var query = 'insert into Mahasiswa ( NRP, Nama, Angkatan, Tgl_lahir ) values ( @NRP, @Nama, @Angkatan, @Tgl_lahir )';
    exec(res, query, param, 1);
});

app.put("/api/mahasiswa/:id", function(req, res){
    var param = [
        { name: 'NRP', sqltype: sql.VarChar, value: req.body.NRP },
        { name: 'Nama', sqltype: sql.VarChar, value: req.body.Nama },
        { name: 'Angkatan', sqltype: sql.Int, value: req.body.Angkatan },
        { name: 'Tgl_lahir', sqltype: sql.Date, value: req.body.Tgl_lahir }
    ]
    var query = "update Mahasiswa set NRP = @NRP, Nama = @Nama, Angkatan = @Angkatan, Tgl_lahir = @Tgl_lahir WHERE id = "+req.params.id;
    exec(res, query, param, 1);
});

app.delete("/api/mahasiswa/:id", function(req, res){
    var query = "delete from Mahasiswa where id =" +req.params.id;
    exec(res, query, null, 0);
});


////////////////////
// CRUD DataDasar //
////////////////////

app.get("/api/datadasar/", function(req, res){
    var query = "select * from DataDasar";
    exec(res, query, null, 0);
});

app.get("/api/datadasar/nama", function(req, res)
{
   var query = 'select id, nama as name from DataDasar';
   exec(res, query, null, 0)
});

app.get("/api/datadasar/:id",function(req, res)
{
   var query = "select * from DataDasar where id=" +req.params.id;
   exec(res, query, null, 0)
})

app.post("/api/datadasar/", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = 'insert into DataDasar ( nama, create_date, last_update, expired_date ) values ( @nama, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP + 365) )'
    exec(res, query, param, 1)
});

app.put("/api/datadasar/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
        // { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = 'update DataDasar set nama = @nama last_update = CURRENT_TIMESTAMP where id = @id';
    exec(res, query, param, 1)
});

app.delete("/api/datadasar/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.params.id }
    ]
    var query = "delete from DataDasar where id = @id";
    exec(res, query, param, 1);
});

////////////////////
//// CRUD Unit ////
///////////////////

app.get("/api/unit/", function(req, res){
    var query = "select * from DataDasar";
    exec(res, query, null, 0);
});

app.get("/api/unit/nama", function(req, res){
    var query = 'select id, nama as name from Unit';
    exec(res, query, null, 0)
});

app.post("/api/unit/", function(req, res){
    var param = [
        { name: 'KategoriUnit_id', sqltype: sql.Int, value: req.body.KategoriUnit_id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    var query = 'insert into Unit ( KategoriUnit_id, nama ) values ( @KategoriUnit_id, @nama )'
    exec(res, query, param, 1)
});

app.put("/api/unit/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'KategoriUnit_id', sqltype: sql.Int, value: req.body.KategoriUnit_id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    var query = 'update Unit set KategoriUnit_id = @KategoriUnit_id, nama = @nama where id = @id';
    exec(res, query, param, 1)
});

app.delete("/api/unit/:id", function(req, res){
    var query = "delete from Unit where id =" +req.params.id;
    exec(res, query, null, 0);
});

/////////////////////////////
//// CRUD Kategori_Unit ////
///////////////////////////

app.get("/api/kategoriunit/", function(req, res){
    var query = "select * from KategoriUnit";
    exec(res, query, null, 0);
});

app.post("/api/kategoriunit/", function(req, res){
    var param = [
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    var query = 'insert into KategoriUnit ( nama ) values ( @nama )';
    exec(res, query, param, 1)
});

app.put("/api/kategoriunit/:id", function(req, res){
    var param = [
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    var query = 'update KategoriUnit set nama = @nama where id =' +req.params.id;
    exec(res, query, param, 1)
});

app.delete("/api/kategoriunit/:id", function(req, res){
    var query = "delete from KategoriUnit where id =" +req.params._id;
    exec(res, query, null, 0);
});

////////////////////////////
//// CRUD Capaian_Unit ////
//////////////////////////

app.get("/api/capaianunit/", function(req, res){
    var query = "select * from Capaian_Unit";
    exec(res, query, null, 0);
});

app.post("/api/capaianunit/", function(req, res){
    var param = [
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'id_datadasar', sqltype: sql.Int, value: req.body.id_datadasar },
        { name: 'capaian', sqltype: sql.VarChar, value: req.body.capaian }
    ]
    var query = 'insert into Capaian_Unit ( id_satker, id_datadasar, waktu, capaian ) values ( @id_satker, @id_datadasar, CURRENT_TIMESTAMP, @capaian )'
    exec(res, query, param, 1)
});

app.put("/api/capaianunit/:id&:id2", function(req, res){
    var param = [
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'id_datadasar', sqltype: sql.Int, value: req.body.id_datadasar },
        { name: 'capaian', sqltype: sql.Float, value: req.body.capaian },
        { name: 'id', sqltype: sql.UniqueIdentifier, value: req.params.id },
        { name: 'id2', sqltype: sql.Int, value: req.params.id2 }
    ]
    var query = "update Capaian_Unit set id_satker = @id_satker, id_dasar = @id_dasar, capaian = @capaian where id_satker = @id and id_datadasar = @id2"
    exec(res, query, param, 1)
});

app.delete("/api/capaianunit/:id&:id2", function(req, res){
    var model = [
        { name: 'id', sqltype: sql.UniqueIdentifier, value: req.params.id },
        { name: 'id2', sqltype: sql.Int, value: req.params.id2 }
     ]
    var query = "delete from Capaian_Unit where id_satker = @id and id_datadasar = @id2";
    exec(res, query, param, 1);
});

///////////////////////////
//// CRUD JenisSatker ////
/////////////////////////

app.get("/api/jenissatker/", function(req, res){
    var query = "select * from JenisSatker";
    exec(res, query, null, 0);
});

app.get("/api/jenissatker/nama", function(req, res){
    var query = 'select id, nama as name from JenisSatker';
    exec(res, query, null, 0)
});

app.post("/api/jenissatker/", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = 'insert into JenisSatker ( nama, create_date, last_update, expired_date ) values ( @nama, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP + 365) )'
    exec(res, query, param, 1)
});

app.put("/api/jenissatker/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        // { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = 'update JenisSatker set nama = @nama, last_update = CURRENT_TIMESTAMP where id = @id';
    exec(res, query, param, 1)
});

app.delete("/api/jenissatker/:id", function(req, res){
    var model = [
        { name: 'id', sqltype: sql.Int, value: req.params.id }
    ]
    var query = "delete from Unit where id = @id";
    exec(res, query, null, 0);
});

///////////////////////
//// CRUD Periode ////
/////////////////////

app.get("/api/periode/", function(req, res){
    var query = "select * from Periode";
    exec(res, query, null, 0);
});

app.get("/api/periode/nama", function(req, res){
    var query = 'select id, nama as name from Periode';
    exec(res, query, null, 0)
});

app.post("/api/periode/", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Numeric, value: req.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    // var query = 'insert into Periode ( nama, create_date, last_update ) values ( @nama, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )'
    var query = 'insert into Periode values ( @id, @nama, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )'
    exec(res, query, param, 1)
});

app.put("/api/periode/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Numeric, value: req.id },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama }
    ]
    var query = 'update Periode set nama = @nama, last_update = CURRENT_TIMESTAMP where id = @id';
    exec(res, query, param, 1)
});

app.delete("/api/periode/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Numeric, value: req.params.id }
    ]
    var query = "delete from Periode where id =" +req.params.id;
    exec(res, query, param, 1);
});


///////////////////////////////
//// CRUD Master Indikator ////
//////////////////////////////

app.get("/api/masterindikator/", function(req, res){
    var query = "select * from MasterIndikator";
    exec(res, query, null, 0);
});

app.get("/api/masterindikator/nama", function(req, res){
    var query = 'select id, nama as name from MasterIndikator';
    exec(res, query, null, 0)
});

app.post("/api/masterindikator/", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        // { name: 'id_aspek', sqltype: sql.Int, value: req.body.id_aspek },
        { name: 'id_pembilang', sqltype: sql.Int, value: req.body.id_penyebut },
        { name: 'id_penyebut', sqltype: sql.Int, value: req.body.id_pembilang },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'deskripsi', sqltype: sql.VarChar, value: req.body.deskripsi },
        { name: 'default_bobot', sqltype: sql.Float, value: req.body.default_bobot },
        { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
   ]

   var query = "insert into MasterIndikator( id_pembilang, id_penyebut, nama, deskripsi, default_bobot, create_date, last_update, expired_date ) values ( @id_pembilang, @id_penyebut, @nama, @deskripsi, @default_bobot, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP+365) )"
   exec(res, query, param, 1)
});

app.put("/api/masterindikator/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        // { name: 'id_aspek', sqltype: sql.Int, value: req.body.id_aspek },
        { name: 'id_pembilang', sqltype: sql.Int, value: req.body.id_penyebut },
        { name: 'id_penyebut', sqltype: sql.Int, value: req.body.id_pembilang },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { name: 'deskripsi', sqltype: sql.VarChar, value: req.body.deskripsi },
        { name: 'default_bobot', sqltype: sql.Float, value: req.body.default_bobot },
        { name: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = "update MasterIndikator set id_pembilang = @id_pembilang, id_penyebut = @id_penyebut, nama = @nama, deskripsi = @deskripsi, default_bobot = @default_bobot, last_update = CURRENT_TIMESTAMP where id = @id";
    exec(res, query, param, 1)
});

app.delete("/api/masterindikator/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.params.id }
    ]
    var query = "delete from MasterIndikator where id =" +req.params.id;
    exec(res, query, param, 1);
});

////////////////////////////
//// Indikator Periode ////
//////////////////////////

app.get("/api/indikatorperiode/", function(req, res){
    var query = "select * from Indikator_Periode";
    exec(res, query, null, 0);
});

app.post("/api/indikatorperiode/", function(req, res){
    var param = [
        { name: 'id_master', sqltype: sql.Int, value: req.id_master },
        { name: 'id_periode', sqltype: sql.Numeric, value: req.id_periode },
        { name: 'bobot', sqltype: sql.VarChar, value: req.body.bobot }
    ]
    var query = 'insert into Indikator_Periode ( id_master, id_periode, bobot ) values ( @id_master, @id_periode, @bobot )'
    exec(res, query, param, 1)
});

app.put("/api/indikatorperiode/:id&:id2", function(req, res){
    var param = [
        { name: 'id_master', sqltype: sql.Int, value: req.id_master },
        { name: 'id_periode', sqltype: sql.Numeric, value: req.id_periode },
        { name: 'bobot', sqltype: sql.VarChar, value: req.body.bobot },
        { name: 'id', sqltype: sql.VarChar, value: req.body.id },
        { name: 'id2', sqltype: sql.VarChar, value: req.body.id2 }
    ]
    var query = "update Indikator_Periode set id_master = @id_master, id_periode = @id_periode, bobot = @bobot where id_master = @id and id_periode = @id2";
    exec(res, query, param, 1)
});

app.delete("/api/indikatorperiode/:id&:id2", function(req, res){
    var param = [
        { name: 'id_master', sqltype: sql.Int, value: req.params.id },
        { name: 'id_periode', sqltype: sql.Numeric, value: req.params.id2 }
    ]
    var query = "delete from Indikator_Periode where id_master = @id_master and id_periode = @id_periode";
    exec(res, query, param, 1);
});

///////////////////////
//// Satuan Kerja ////
/////////////////////

app.get("/api/satuankerja/", function(req, res){
    var query = "select * from SatuanKerja";
    exec(res, query, null, 0);
});

app.get("/api/satuankerja/nama", function(req, res){
    var query = "select id, nama as name from SatuanKerja";
    exec(res, query, null, 0);
});

app.post("/api/satuankerja/", function(req, res){
    var param = [
        // { name: 'id', sqltype: sql.UniqueIdentifier, value: req.body.id },
        { name: 'id_jns_satker', sqltype: sql.Numeric, value: req.body.id_jns_satker },
        { name: 'id_induk_satker', sqltype: sql.VarChar, value: req.body.id_induk_satker },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { nama: 'email', sqltype: sql.VarBinary, value: req.body.email },
        { nama: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = "insert into SatuanKerja ( id, id_jns_satker, id_induk_satker, nama, email, create_date, last_update, expired_date) values ( @id, @id_jns_satker, @id_induk_satker, @nama, @email, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, (CURRENT_TIMESTAMP+365) )"
    exec(res, query, param, 1)
});

app.put("/api/satuankerja/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.UniqueIdentifier, value: req.body.id },
        { name: 'id_jns_satker', sqltype: sql.Numeric, value: req.body.id_jns_satker },
        { name: 'id_induk_satker', sqltype: sql.VarChar, value: req.body.id_induk_satker },
        { name: 'nama', sqltype: sql.VarChar, value: req.body.nama },
        { nama: 'email', sqltype: sql.VarBinary, value: req.body.email },
        { nama: 'expired_date', sqltype: sql.DateTime, value: req.body.expired_date }
    ]
    var query = "update SatuanKerja set id_jns_satker = @id_jns_satker, id_induk_satker = @id_induk_satker, nama = @nama, email = @email, last_update = CURRENT_TIMESTAMP where id = @id";
    exec(res, query, param, 1)
});

app.delete("/api/satuankerja/:id", function(req, res){
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.params.id },
    ]
    var query = "delete from SatuanKerja where id = @id";
    exec(res, query, param, 1);
});

////////////////////////////////
//// Indikator Satuan Kerja ////
///////////////////////////////

app.get("/api/indikatorsatuankerja/", function(req, res){
    var query = "select * from Indikator_SatuanKerja";
    exec(res, query, null, 0);
});

app.post("/api/indikatorsatuankerja/", function(req, res){
    var param = [
        { name: 'id_periode', sqltype: sql.Numeric, value: req.body.id_periode },
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
        { name: 'target', sqltype: sql.Float, value: req.body.target },
        { name: 'capaian', sqltype: sql.Float, value: req.body.capaian }
   ]
   var query = "insert into Indikator_SatuanKerja ( id_periode, id_master, id_satker, bobot, target, capaian, last_update) values ( @id_periode, @id_master, @id_satker, @bobot, @target, @capaian, CURRENT_TIMESTAMP)"
   exec(res, query, param, 1)
});

app.put("/api/indikatorsatuankerja/:id", function(req, res){
    var param = [
        { name: 'id_periode', sqltype: sql.Numeric, value: req.body.id_periode },
        { name: 'id_master', sqltype: sql.Int, value: req.body.id_master },
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.body.id_satker },
        { name: 'bobot', sqltype: sql.Float, value: req.body.bobot },
        { name: 'target', sqltype: sql.Float, value: req.body.target },
        { name: 'capaian', sqltype: sql.Float, value: req.body.capaian },
        { name: 'id', sqltype: sql.Numeric, value: req.params.id },
        { name: 'id2', sqltype: sql.Int, value: req.params.id2 },
        { name: 'id3', sqltype: sql.UniqueIdentifier, value: req.params.id3 }
    ]
    var query = "update Indikator_SatuanKerja set id_periode = @id_periode, id_master = @id_master, id_satker = @id_satker, bobot = @bobot, target = @target, " +
                "capaian = @capaian, last_update = CURRENT_TIMESTAMP where id_periode = @id and id_master = @id2 and id_satker = @id3";
    exec(res, query, param, 1)
});

app.delete("/api/indikatorsatuankerja/:id", function(req, res){
    var param = [
        { name: 'id_periode', sqltype: sql.Numeric, value: req.params.id },
        { name: 'id_master', sqltype: sql.Int, value: req.params.id2 },
        { name: 'id_satker', sqltype: sql.UniqueIdentifier, value: req.params.id3 }
    ]
    var query = "delete from Indikator_SatuanKerja where id_periode = @id_periode and id_master = @id_master and id_satker = @id_satker";
    exec(res, query, param, 1);
});

/////////////////////////////////////
//// Indikator Satuan Kerja LOG ////
///////////////////////////////////

app.get("/api/logindikatorsatker", function(req, res){
    var query = "select * from Indikator_SatuanKerja_Log";
    exec(res, query, null, 0)
});

////////////////
//// Aspek ////
//////////////

//Select
app.get("/api/aspek/", function(req, res)
{
    var query = "select * from Aspek";
    exec(res, query, null, 0)
})

app.get("/api/aspek/nama", function(req, res)
{
    var query = 'select id, aspek as name from Aspek';
    exec(res, query, null, 0)
})

app.get("/api/aspek/:id",function(req, res)
{
    var query = "select * from Aspek where id=" + req.params.id;
    exec(res, query, null, 0)
})

//Insert
app.post("/api/aspek/", function(req, res)
{
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'aspek', sqltype: sql.VarChar, value: req.body.aspek },
        { name: 'komponen_aspek', sqltype: sql.VarChar, value: req.body.komponen_aspek }
    ]
    var query = 'insert into Aspek ( aspek, komponen_aspek ) values( @aspek, @komponen_aspek )';
    exec(res, query, param, 1)
})

//Update
app.put("/api/aspek/:id", function(req, res) {
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.body.id },
        { name: 'aspek', sqltype: sql.VarChar, value: req.body.aspek },
        { name: 'komponen_aspek', sqltype: sql.VarChar, value: req.body.komponen_aspek }
    ]
    var query = 'update Aspek set aspek = @aspek, komponen_aspek = @komponen_aspek where id = @id';
    exec(res, query, param, 1)
})

//Delete
app.delete("/api/aspek/:id", function(req, res)
{
    var param = [
        { name: 'id', sqltype: sql.Int, value: req.params.id }
    ]
    var query = "delete from Aspek where id = @id";
    exec(res, query, param, 1)
})

// LISTEN
app.listen(port, function () {
    var message = "Server runnning on Port: " + port;
    console.log(message);
});

