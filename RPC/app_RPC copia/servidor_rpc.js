//Es necesario instalar en la carpeta del servidor los modulos cors y express

var rpc = require("./rpc.js"); //incorporamos la libreria
var datos = require("./datos.js"); //incorporamos los datos
const { application } = require("express");

//PROPIO DEL SERVIDOR
let servidor = rpc.server(); // crear el servidor RPC
var app = servidor.createApp("gestion_pacientes"); // crear aplicación de RPC

//creamos las variables a partir de los datos que existen en el fichero datos.js
var medicos = datos.medicos;
var pacientes = datos.pacientes;
var medicamento = datos.medicamento;
var datosMedicacion = datos.medicacion; //SE tiene que poner asi por tener una funcion que sea medicacion?
var tomas = datos.tomas;

var siguienteMedico = datos.siguienteMedico;
var siguientePaciente = datos.siguientePaciente;
var siguienteMedicamento = datos.siguienteMedicamento;
var siguienteMedicacion = datos.siguienteMedicacion;
var siguienteToma = datos.siguienteToma;







// FUNCIONES A IMPLEMENTAR



//Realiza un login para un paciente
//Devuelve un objeto con los datos del pacinete o NULL si el código no es correcto
function login(codigoAcceso){
//Verificar código de acceso del paciente
    console.log("Codigo", codigoAcceso)
    const pacienteEncontrado = pacientes.find(function(paciente){
            return codigoAcceso === paciente.codigo_acceso;
    })
    console.log("paciente", pacienteEncontrado);
    return pacienteEncontrado;
}






//Obtiene un listado de los medicamentos
//Devuelve un array con todos los medicamentos

function listadoMedicamentos(){
    return medicamento; //esto no esta bien--> deberia devolver los datos de los medicamentos

}




//Obtiene los datos del médico indicado
//Devuelve un objeto con los datos del médico excepto el login y el password. si no existe NULL
function datosMedico(idMedico){
    const medicoEncontrado = medicos.find(function(medico){
        if(medico.id == idMedico){
            medicoEncontrado = {
                id : medico.id,
                nombre : medico.nombre,
                apellidos: medico.apellidos
            }

        }
        
    });
    return medicoEncontrado;


}


//Obtiene un listado de la medicación del paciente
//Devuelve un array con toda la medicación para este paciente
function medicacion(idPaciente){
    console.log("ID paciente", idPaciente);
    var medicacionPaciente = [];
    // En el servidor decidir si la medicacion va en rojo o verde.
    for (var i=0; i < datosMedicacion.length; i++){
        if (datosMedicacion[i].paciente === idPaciente){
            medicacionPaciente.push(datosMedicacion[i]);
        }
    }
    return medicacionPaciente;
}



//Obtiene un listado de tomas
//Devuelve un array con las tomas para ese pacientes y ese medicamento
function listadoTomas(idPaciente, idMedicamento){
    var listaTomas = [];
    for (var i = 0; i < tomas.length; i++){
        if(tomas[i].paciente === idPaciente && tomas[i].medicamento === idMedicamento){
            listaTomas.push(tomas[i])
        }
    }
    console.log("TOMAS", listaTomas)
    return listaTomas;
}


//Añade una nueva toma
//Devuelve todos los datos de la toma, incluyendo la fecha
function agregarToma(idPaciente, idMedicamento){
    var nuevaToma ={
        medicamento : idMedicamento,
        paciente: idPaciente,
        fecha: new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().slice(0,-5),
    }
    tomas.push(nuevaToma);

}




//Eliminar una toma
//Devuelve booleano si ha ido bien
function eliminarToma(idPaciente, idMedicamento, fecha){
    console.log("ID Paciente", idPaciente);
    console.log("ID medicamento", idMedicamento);
    console.log("Fecha", fecha);
    for (var i=0; i < tomas.length; i++){
        if(tomas[i].medicamento === idMedicamento && tomas[i].paciente === idPaciente  && tomas[i].fecha === fecha){
            tomas.splice(i,1);
            console.log("Toma borrada correctamente");
            return true;

        }else{
            return false;
        }
    }
}
    
















//Registramos los procedimientos para su utilización.
app.register(login);
app.register(listadoMedicamentos);
app.register(datosMedico);
app.register(medicacion);
app.register(listadoTomas);
app.register(agregarToma);
app.register(eliminarToma);


