const Tarea = require('../models/Tareas');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

//crea nueva tarea
exports.crearTarea = async(req,res) => {

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()});
    }

    
    try {
        
        //extraer proyecto y mirar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'proyecto no encontrado'});
        }

        //revisar proyecto actual este autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"});
        }

        //crea tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo error');
    }
}

//obtiene las tareas
exports.obtenerTareas = async(req,res) => {

    try {
        
        //extraer proyecto y mirar si existe
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'proyecto no encontrado'});
        }

        //revisar proyecto actual este autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"});
        }

        //obtener tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado:-1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo error');
    }
}

//actualizar una tarea
exports.actualizarTarea = async(req,res) => {

    try {
        
        //extraer proyecto y mirar si existe
        const { proyecto,nombre,estado } = req.body;

        //existe tarea o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg:"No Existe Tarea"});
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //revisar proyecto actual este autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:"No autorizado"});
        }

        //crea objeto con nueva informacion
        const nuevaTarea = {};
        
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        //guardar tarea
        tarea = await Tarea.findByIdAndUpdate({_id:req.params.id},nuevaTarea,{new:true});

        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo error');
    }
}

//elimina tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto  } = req.query;

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}