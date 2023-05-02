


//Vinculamos cliente - servidor. Obtener una referencia a la app RPC (instancia de la aplicación gestion pacientes del servidor localhost)
var app = rpc("localhost", "gestion_pacientes");

//Obtener referencias a los procedimientos remotos registrados por el servidor.
var pacienteActual = {};


var login = app.procedure("login");
var medicacion = app.procedure("medicacion")
var listadoMedicamentos = app.procedure("listadoMedicamentos");
var datosMedico = app.procedure("datosMedico");
var listadoTomas = app.procedure("listadoTomas");
var agregarToma = app.procedure("agregarToma");
var eliminarToma = app.procedure("eliminarToma");





/*
CAMBIAR LA SECCIÓN
var seccionActual = "login";
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}


function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.toggle("activa");
    document.getElementById(seccion).classList.toggle("activa");
    seccionActual=seccion;
    }


*/


/* PROGRAMACIÓN ASÍNCRONA
   TODOS LOS PROCEDIMIENTOS SE LLAMAN ASÍ:
   procedimiento(argumentos, function (resultado) {
    ...
   });
   NO ES BLOQUEANTE, EL CÓDIGO DE DEBAJO CONTINUA ANTES QUE EL CALLBACK. El callback da la respuesta cuando la tenga
*/

//Login
function loginCliente(){
    var codigoAcceso = document.getElementById("codigoAcceso").value;
    console.log("CODIGO ACCESO:", codigoAcceso);
    // Llamaremos a la funcion de el servidor
    login(codigoAcceso, function(pacienteEncontrado){
        console.log("Paciente", pacienteEncontrado);
        pacienteActual = pacienteEncontrado;
        cargarListaMedicacion();
        // document.getElementById("listaMedicacion").style.color= "red"; 
    });

}



// Decidir si va en rojo o en verde
async function esVerde(medicacion){
    // obtienes las tomas
    // const tomas =  obtenerTomasMedicacion(medicacion)
    const tomas = await listadoTomas(pacienteActual.id, medicacion.medicamento);
    console.log("TOMAS EXV", tomas);
    if (tomas){
       
   
        var ultimaToma = tomas?.slice(-1)[0];
        var hoy = new Date(); // Hoy
        console.log("hoy", ultimaToma)
        var tiempoPasado = hoy - new Date(ultimaToma.fecha); // Tiempo transcurrido en ms
        console.log("TIEMPO PAS", tiempoPasado);
        var diasPasados = tiempoPasado / (24 * 60 * 60 * 1000); // en dias
        console.log(diasPasados);
        
        if (diasPasados < medicacion.frecuencia) {
            console.log("Devuelvo true")
            return true;
        }
    }
    console.log("DEVUELVO FALSE")
    return false;    
}

//Función para mostrar la lista de medicamentos
//ESTA FIUNCIÓN NO ESTÁ BIEN
async function mostrarListaMedicacion(medicacion){
    
    var listaMedicacion = document.getElementById("listaMedicacion");
    // Obtener lista medicamentos
    let medicamentos = listadoMedicamentos()


    let innerText ="";
    for (var i =0; i<medicacion.length; i ++){
        const isVerde = await esVerde(medicacion[i]);
        console.log("is verde", isVerde)
        if (isVerde){
            innerText+= "<ul style='color:green'>" 
        }else{
            console.log("ES ROJO")
            innerText+= "<ul style='color:red'>"
        }

        // Obtener el nombre del medicamento a traves del id
        
        //let nombreMedicamento = medicamentos.find((medicamento) => medicamento.id === medicacion[i].medicamento)
        
        let objetoMedicamento = medicamentos.find(function(medicamento){
            return medicamento.id === medicacion[i].medicamento;

        })
        let data = {
            id: medicacion[i].medicamento,
            nombre: objetoMedicamento.nombre
        }
        innerText+= "<li>" + "Medicamento: " + objetoMedicamento.nombre + "</li>" + 
        "<li>" + "Fecha de asignación : "+ medicacion[i].fecha_asignacion + "</li>" +
        "<li>" + "Dosis: "+  medicacion[i].dosis + "</li>" +
        "<li>" + "Tomas:  "+ medicacion[i].tomas + "</li>" +
        "<li>" + "Frecuencia:  "+ medicacion[i].frecuencia + "</li>" +
        "<li>" + "Observaciones: "+ medicacion[i].observaciones + "</li>" +
        '<button onclick=\'mostrarListaTomas('+ data.id + ',"' + data.nombre + '")\'>Ver tomas</button>'  + 
        "<br>" + "</br>"
        innerText += "</ul>";
        
        }
        listaMedicacion.innerHTML = innerText;

}

//Función para cargar la lista de medicamentos
function cargarListaMedicacion(){
    medicacion(pacienteActual.id, function (medicacion){
        mostrarListaMedicacion(medicacion);

    });
}


function llamarAgregarToma(idMedicamento, nombre){
    agregarToma(idMedicamento, pacienteActual.id, function(){
        mostrarListaTomas(idMedicamento, nombre)
    });
}


function llamarEliminarToma(idMedicamento, nombre, fecha){
    eliminarToma(idMedicamento, pacienteActual.id, fecha, function(){
        mostrarListaTomas(idMedicamento, nombre)
    });

}


async function mostrarListaTomas( idMedicamento, nombre){
    let listaTomas = await listadoTomas(pacienteActual.id, idMedicamento);
    console.log("TOMAS RECIBIDAS", idMedicamento, nombre)
    
    let listaTomasElement = document.getElementById("listaTomas");
    listaTomasElement.innerHTML=""
    

    for (var i = 0; i < listaTomas.length; i++){

        listaTomasElement.innerHTML += "<li> Nombre:" + nombre + "</li>" +
        "<li> Paciente:" + pacienteActual.id + "</li>" +
        "<li> Fecha:" + listaTomas[i].fecha.replace("T", " ") + "</li>"+
        '<button onclick=\'llamarEliminarToma('+ idMedicamento + ',"' + nombre + '","'+ listaTomas[i].fecha + '")\'>Eliminar tomas</button>' +
        "<br>" + "</br>"
    }
    listaTomasElement.innerHTML += 
    '<button onclick=\'llamarAgregarToma('+ idMedicamento + ',"' + nombre + '")\'>Añadir tomas</button>'  

    
    
}







//salir de la aplicación - debe ir al login
function salir(){
    cambiarSeccion("login");
}