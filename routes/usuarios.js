//rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require("express-validator");


//crea un usuario
// api/usuarios
router.post('/',
    [
        check('nombre','Nombre obligatorio').not().isEmpty(),
        check('email','Agrega email valido').isEmail(),
        check('password','password minimo 6 caracteres').isLength({min:6})
    ],
    usuarioController.crearUsuario
);
module.exports = router;