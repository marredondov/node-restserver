const express = require('express');
const _ = require('underscore');
const { verificarToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/Producto');



//=============================
// Obtener todos los productos
//=============================
app.get('/productos', (req, res) => {
    //populate: usuario categoria
    //paginado
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let condicion = {
        disponible: true
    }
    Producto.find(condicion, 'nombre descripcion precioUni img')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    productoDB,
                    cuantos: conteo
                });

            });

        });
});

//=============================
// Obtener un producto por ID
//=============================
app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({ // error de base de datos serio
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

//=============================
// Crear un producto
//=============================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({ // error de base de datos serio
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });
});

//=============================
// Crear un producto
//=============================
app.post('/productos', verificarToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.precioUni = body.precioUni;
    producto.descripcion = body.descripcion;
    producto.disponible = body.disponible;
    producto.categoria = body.categoria;
    producto.img = body.img;
    producto.usuario = req.usuario._id;

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.status(201).json({
            ok: true,
            productoDB
        });
    });
});

//=============================
// actualizar un producto
//=============================
app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});

//=============================
// Crear un producto
//=============================
app.delete('/productos/:id', (req, res) => {
    //cambiar el estado disponible a false
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});

module.exports = app;