const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crea servidor
const app = express();

//conectar db
conectarDB();

//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended:true}));

//puerto app
const port = process.env.port || 4000;

//imporat rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//inicia app
app.listen(port, '0.0.0.0', () =>{
    console.log("arranco el server en ${PORT}");
});