const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    //extraer email y password
    const {email, password} = req.body;

    try {
        //revisa si hay un usuario
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg:'usuario ya existe'});
        }

        //crea usuario
        usuario = new Usuario(req.body);

        //hashear password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);

        //guardar usuario
        await usuario.save();

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
        console.log(error);
        res.status(400).send("Hubo un error");
    }    
}