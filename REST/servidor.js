var express = require("express");
var app = express();
const cors = require("cors");
let datos = require('./datos.js');
//console.log(datos); //sirve para visualizar los datos del archivo datos.js en la terminal del servidor.


app.use("/apiCliente", express.static("cliente")); 
app.use(express.json()); 
app.use(cors());



//utilizar las variabels introducidas en datos.js
var medicos=datos.medicos;
var pacientes=datos.pacientes;
var medicamento=datos.medicamento;
var medicacion=datos.medicacion;
var tomas=datos.tomas;

var siguienteMedico=datos.siguienteMedico;
var siguientePaciente=datos.siguientePaciente;
var siguienteMedicamento=datos.siguienteMedicamento;
var siguienteMedicacion=datos.siguienteMedicacion;
var siguienteToma=datos.siguienteToma;


app.get("/api/medicamento", function (req, res) {
    res.status(200).json({medicamento});
});


/**
 * req - Es el parametro de entrada con los datos que vienen de cliente
 * res - Es el parametro de salida del servidor con los datos que se envian al cliente.
 */

app.post("/api/medico/login", function(req, res) {

    const usuario = req.body.usuario;
    const contrasenya = req.body.password;

    medicos.forEach(function(medico){
        if(medico.login == usuario && medico.password == contrasenya){
            res.status(201).json({ desc: "Se ha identificado al médico correctamente", id:  medico.id});
            console.log("Se ha identificado correctamente al médico con id", medico.id);
            return;   
        }
    });
    
    //res.status(403).json({error: "La autenticación es incorrecta"}); // esta línea me da error porque intenta mandar dos repsuestas al cliente
});


app.get("/api/paciente/:id",function(req, res){

    /* 
     1 - crear una constante id que sea el valor del id de la request.
     2 - crear una constante pacienteEncontrado que buscará en datos.js si el id que hemos creado
        coincide con el id de algún paciente que ya tengamos creado.
    */

    const id = req.params.id;

    const pacienteEncontrado = pacientes.find(function(paciente){
            return paciente.id == parseInt(id);
        }
    )
    console.log("Paciente encontrado con id" + id);
    res.status(200).json({pacienteEncontrado, result: "Paciente encontrado!!!!"});
});


app.get("/api/medico/:id", function(req, res){

    const id= req.params.id;

    
    const medicoEncontrado= medicos.find(function(medico){
           return medico.id == parseInt(id);
        }
    )

    console.log("Médico encontrado con id", id, "con nombre", medicoEncontrado.nombre);
    res.status(200).json(medicoEncontrado);

    
});




app.get("/api/medico/:id/pacientes", function(req, res){

    const id= req.params.id;
    var listaPacientes = [];

    pacientes.forEach(function(paciente){
        // En cada una de las vueltas del foreach tienes cada una de las posiciones del array
        // En la vuelta 0 tienes la posicion 0....

        if (paciente.medico == id){
            listaPacientes.push(paciente);
        }
        
    });

   res.status(200).json(
    {listaPacientes, result: `Lista de pacientes del médico con id ${id}`
    });
});


app.post("/api/medico/:id/pacientes", function(req, res){

    const nuevoPaciente = req.body;
    nuevoPaciente.id = siguientePaciente;
    siguientePaciente++;
    nuevoPaciente.medico = parseInt(req.params.id);
    

    pacientes.push(nuevoPaciente);

    console.log("Nuevo Paciente:", nuevoPaciente);

    res.status(201).json({ok: "paciente guardado"})

});


app.put("/api/paciente/:id", function(req, res){

    const id = req.params.id;
    let pacienteAModificar = {};
    console.log("ID", id);
   for(var i=0; i<pacientes.length; i++){
        if (pacientes[i].id == id){
            console.log("Paciente encontrado");

        /*
        if (req.body.nombre){
            nombre = req.body.nombre
        }else{
            nombre = pacienteAModificar.nombre
        }*/
        pacienteAModificar = {
            id : pacientes[i].id,
            nombre : req.body?.nombre  ? req.body.nombre : pacientes[i].nombre,
            apellidos : req.body?.apellidos  ? req.body.apellidos : pacientes[i].apellidos,
            fecha_nacimiento : req.body?.fecha_nacimiento ? req.body.fecha_nacimiento :  pacientes[i].fecha_nacimiento,
            genero : req.body?.genero ? req.body.genero: pacientes[i].genero,
            medico: req.body?.medico? req.body.medico : pacientes[i].medico,
            codigo_acceso: req.body?.codigo_acceso ? req.body.codigo_acceso : pacientes[i].codigo_acceso,
            observaciones: req.body?.observaciones ? req.body.observaciones : pacientes[i].observaciones,
        }
        console.log("Paciente a modificar", pacienteAModificar)
        pacientes[i] = pacienteAModificar;

    }
   };
    console.log("El paciente con id", id, "ha sido modificado", pacienteAModificar);
    res.status(200).json({ok:"paciente modificado"});
});


app.get("/api/paciente/:id/medicacion", function(req, res){
    const id = req.params.id;
    var listaMedicacion = [];
    
    medicacion.forEach(function(medicacionPaciente){
        if(medicacionPaciente.paciente == id){
            listaMedicacion.push(medicacionPaciente);
        }
    });
  
    
    res.status(200).json({
        listaMedicacion,
        result: `Lista de medicación del paciente con id ${id}`
    });
});



app.post("/api/paciente/:id/medicacion", function(req, res){

    //Cojo todo lo que se haya introducido en el body de la request
    // Buscamos si el medicamento ya existe haciendo un find en el array
    // Comparamos el medicamento que viene por parametros con cada uno de los medicamentos del array.
    const id = parseInt(req.params.id);
    
    const medicamentosPaciente = medicacion.filter((medicamento) => medicamento.paciente === id);
    
    const findAlreadyExist = medicamentosPaciente.find((med) => req.body.medicamento === med.medicamento);
    
    if (findAlreadyExist === undefined){
        const nuevaMedicacion = req.body;
    
        //Asigno a esa medicación el id (será igual que la variable siguiente medicación)
        nuevaMedicacion.medicamento = req.body.medicamento;
        console.log("Medicacion", nuevaMedicacion)


        //Asigno a esa medicación el paciente, que será el que tenga el id que se ha pasado en el req.
        nuevaMedicacion.paciente =  id;

        //añade a medicación esa medicación nueva
        medicacion.push(nuevaMedicacion);

        console.log("Nueva medicación:", nuevaMedicacion);

        res.status(201).json({ok: "medicación guardada"})
    } else {
        res.status(404).send({desc: "El medicamento ya existe en el paciente"})
    }

});



app.get("/api/paciente/:id/medicacion/:idm", function(req, res){
    
    var id = req.params.id;
    var idm = req.params.idm; 

    var tomasPaciente = [];
    console.log("TOMAS ", tomas , "PARAMS", id, idm)
    tomas.forEach(function(nuevaToma){
        if (nuevaToma.paciente == id && nuevaToma.medicamento == idm){
            tomasPaciente.push(nuevaToma);
        }
    });

    console.log("El paciente", id, "tiene las siguientes tomas:", tomasPaciente);
    res.status(200).json({tomasPaciente});
});



app.listen(3000, function(){
    console.log("Servidor escuchando en puerto 3000");
});