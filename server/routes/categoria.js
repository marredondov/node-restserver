const express = require('express');
const _ = require('underscore');
let { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/Categoria');

//=================================
// Mostrar todas las categorias
//=================================
app.get('/categoria', verificarToken, (req, res) => {
    let condicion = {}

    Categoria.find(condicion, 'nombre usuario')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            });

        });
});

//=================================
// Mostrar una categorias por ID
//=================================
app.get('/categoria/:id', verificarToken, (req, res) => {
    // Categoria,findById(.......)
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({ // error de base de datos serio
                ok: false,
                err: { message: 'Categoría no encontrada' }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

//=================================
// Crea una nueva categoria
//=================================
app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    let body = req.body;
    let IdUsuario = req.usuario._id;
    let categoria = new Categoria();
    categoria.nombre = body.nombre;
    categoria.usuario = IdUsuario;

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//=================================
// actualizar la descripcion de la categoria
//=================================
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({ // error de base de datos serio
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            catagoria: categoriaDB
        });
    });
});

//=================================
// eliminar una categoria
//=================================
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    //SOLO UN ADMINISTRADOR PUEDE BORRAR CATEGORIA
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });

});


module.exports = app;