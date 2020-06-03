const express = require('express')
const Usuario = require('./../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express()

const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');


app.get('/usuario', verificarToken, (req, res) => {

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let condicion = {
        estado: true
    }

    Usuario.find(condicion, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        });
})

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuarioDB
        });
    });
})

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    //let body = req.body;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

})

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;

    //eliminacion fisica
    // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    // cambia el estado
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


})

app.post('/google', (req, res) => {
    let token = req.body.idtoken;
    res.json({
        token
    });
});


module.exports = app