var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../Connection/connect")();

var routes = function()
{
    router.route('/')
        .get(function(req, res)
        {
            conn.connect().then(function()
            {
                var sqlQuery = "Select * from mahasiswa";
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function(recordset)
                {
                    res.json(recordset.recordset);
                    conn.close();
                })
                    .catch(function(err){
                        conn.close();
                        res.status(400).send("Error");
                    });
            })
                .catch(function(err){
                    conn.close();
                    res.status(400).send("Error");
                });
        });
    router.route('/')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("NRP", sql.VarChar(50), req.body.NRP)
                    request.input("Nama", sql.VarChar(50), req.body.Nama)
                    request.input("Angkatan", sql.Int(), req.body.Angkatan)
                    request.input("Tgl_lahir", sql.Date(), req.body.Tgl_lahir)
                    request.execute("Usp_InsertMahasiswa").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error 1");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error 2");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error 3");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error 4");
            });
        });
    router.route('/:id')
        .put(function (req, res)
         {
            var _mahasiswaID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("Id", sql.Int(), _mahasiswaID)
                    request.input("NRP", sql.VarChar(50), req.body.NRP)
                    request.input("Nama", sql.VarChar(50), req.body.Nama)
                    request.input("Angkatan", sql.Int(), req.body.Angkatan)
                    request.input("Tgl_lahir", sql.Date(), req.body.Tgl_lahir)
                    request.execute("Usp_UpdateMahasiswa").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error 1");});
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error 2");});
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error 3");});
            }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error 4");});
        });
    router.route('/:id')
        .delete(function (req, res) {
            var _mahasiswaID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("Id", sql.Int, _mahasiswaID)
                    request.execute("Usp_DeleteProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("MahasiswaID:" + _mahasiswaID);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            })
        });

    return router;       
};
module.exports = routes;