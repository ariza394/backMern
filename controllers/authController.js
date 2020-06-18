const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req,res) =>{

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg:'usuario no existe'});
        }

        //revisa pass
        const passCorrecto = await bcryptjs.compare(password,usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'pass incorrecto'});
        }

        //si todo es correcto
        //crear y firmar jwt
        const payload = {
            usuario:{
                id:usuario.id
            }
        };

        //firmar jwt
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600
        },(error,token) =>{
            if(error) throw error;

            //mensaje confirmacion
            res.json({token});
        });
    } catch (error) {
        console.log(error)
    }
}

//obtiene el usuario autenticado
exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'});
    }
}