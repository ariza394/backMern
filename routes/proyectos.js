const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crea un proyectos
// api/proyectos
router.post('/', 
    auth,
    [
        check('nombre','Nombre obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

//obtener todos los proyectos
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
)

//actualziar proyecto con ID
router.put('/:id',
    auth,
    [
        check('nombre','Nombre obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//elimina proyecto con ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;