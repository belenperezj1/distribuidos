// rest.get(url, callback)
// rest.post(url, body, callback)
// rest.put(url, body, callback)
// rest.delete(url, callback)
// function callback(estado, respuesta) {...}




var idMedico;
var idPacienteGL;

function init(){
    document.getElementById("fechaAsigMed").valueAsDate = new Date();
}
init();
/*
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



//ENTRAR A LA APLICACIÓN
function login(){
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    console.log("Login", usuario);
    var credenciales = { usuario : usuario  , password : password };

    console.log("Credenciales", credenciales);
    rest.post("http://localhost:3000/api/medico/login", credenciales, function(estado, respuesta){
        if (estado == 201){
            console.log("Login correcto", respuesta);
            idMedico = respuesta.id;
            cargarListaPacientes();
            datosMedico();
            rellenarSelectMedicacion();
        }else{
            console.log("Identificación incorrecta");
        }

    })
};


function rellenarSelectMedicacion(){
    rest.get("http://localhost:3000/api/medicamento", function(estado, respuesta){
        console.log("Estado" , estado, "Medicamento" , respuesta);
        var selectMedicacion = document.getElementById("nombreMed");
       
        a = respuesta.medicamento;
        
        for (var i = 0; i<a.length; i++){
           // document.getElementById("nombrePaciente").value = "Seleccione un medicamento"
            const option = document.createElement("option");
            option.text  = a[i].nombre;
            selectMedicacion.appendChild(option);
            
        }

    })

}

//obtener los datos del medico
function datosMedico(){
    rest.get("http://localhost:3000/api/medico/" + idMedico, function(estado, respuesta){
        console.log("Estado" , estado, "Medico" , respuesta);
        if (estado != 200){
            alert("Error cargando los datos del médico");
            return;
        }
        document.getElementById("nombreMedico").innerHTML = respuesta.nombre;
        
    })
}




//CARGAR LA LISTA DE PACIENTES DE UN MÉDICO
function cargarListaPacientes(){
    rest.get("http://localhost:3000/api/medico/" + idMedico +  "/pacientes", function (estado, respuesta){
        console.log("Estado" , estado, "Pacientes" , respuesta);
        if (estado != 200){
            alert("Error cargando la lista de pacientes");
            return;
        }
        
        const pacientes = respuesta.listaPacientes;
        var listaPacientes = document.getElementById("listaPacientes");
        listaPacientes.innerHTML = "";
        for (var i =0; i < pacientes.length; i++){
            console.log("i", i, pacientes[i])
            listaPacientes.innerHTML += "<li>" + pacientes[i].id + " - " + pacientes[i].nombre + " - " + 
            pacientes[i].apellidos + " - " + pacientes[i].fecha_nacimiento + " - " + pacientes[i].genero + " - " + 
            pacientes[i].medico  + " - " + pacientes[i].codigo_acceso + " - " + pacientes[i].observaciones + 
            " <button onclick='verExpediente(" + pacientes[i].id + ")'>Ver Expediente del Paciente</button>" + "</li>";
        
        }
       // cambiarSeccion("paginaPrincipalMedico")
    });
}



//AÑADE UN PACIENTE A LA LISTA DE PACIENTES DE UN MÉDICO
function anyadirPaciente(){
    var nuevoPaciente = {
        nombre : document.getElementById("nombrePaciente").value,
        apellidos : document.getElementById("apellidosPaciente").value,
        fecha_nacimiento : document.getElementById("fechaNacimientoPaciente").value,
        genero : document.getElementById("generoPaciente").value,
        //medico : document.getElementById("medicoPaciente").value,
        codigo_acceso : document.getElementById("codigoPaciente").value,
        observaciones : document.getElementById("observacionesPaciente").value
    };
    console.log(nuevoPaciente);
    rest.post("http://localhost:3000/api/medico/"+ idMedico+"/pacientes", nuevoPaciente, function(estado, respuesta){
        console.log("AÑADIENDO PACIENTE", respuesta); 
        if (estado == 201){
            actualizarListaPacientes(); 
        } else {
            alert ("Error introduciendo nuevo paciente");
        }
    });
}

// una vez que se añada un nuevo paciente, se borra los campos introducidos en el input y se carga la lista
// de pacientes con el paciente añadido
function actualizarListaPacientes(){ 
    // 
    document.getElementById("nombrePaciente").value = ""

    // 
    cargarListaPacientes();
    
}

//VER EL EXPEDIENTE DE UN PACIENTE
function verExpediente(idPaciente){
    console.log("ID Paciente", idPaciente)
    idPacienteGL = idPaciente;
    rest.get("http://localhost:3000/api/paciente/" +  idPaciente, function(estado, respuesta){
        console.log("Estado" , estado, "Datos del Paciente" , respuesta);

        if (estado != 200){
            alert("Error cargando el expediente del paciente");
            return;
        }

            const datosPaciente =  respuesta.pacienteEncontrado;
            console.log("Paciente encontrado con datos:", datosPaciente);
            var pacienteEncontrado = document.getElementById("expedientePac");
            pacienteEncontrado.innerHTML = "";
            document.getElementById("nomPac").innerHTML = datosPaciente.nombre; //Sirve para que se muestre el nombre del paciente donde en el html pone nomPac como id
            pacienteEncontrado.innerHTML += "<li> Id: " + datosPaciente.id +  "</li>" +
            "<li> Nombre: " + datosPaciente.nombre + "<input id='nombreActualizado'/>"+ "</li>" +
            "<li> Apellidos: " + datosPaciente.apellidos + "<input id='apellidosActualizado'/>"+ "</li>" + 
            "<li> Fecha de Nacimiento: " + datosPaciente.fecha_nacimiento + "<input id='fechaActualizado'/>" + "</li>" + 
            "<li> Género: " + datosPaciente.genero + "<input id='generoActualizado'/>" + "</li>" + 
            "<li> Código de acceso: " + datosPaciente.codigo_acceso + "<input id='codigoActualizado'/>" + "</li>" +
            "<li> Observaciones: " + datosPaciente.observaciones + "<input id='observacionesActualizado'/>" + "</li>" +
            " <button onclick='actualizarDatosPaciente(" + idPaciente + ")'>Actualizar datos</button>"

        
            

    });

    
    rest.get("http://localhost:3000/api/paciente/"+ idPaciente + "/medicacion", function(estado, respuesta){
            console.log("Estado" , estado, "Medicación" , respuesta);
            if (estado != 200){
                console.log("Error cargando la lista de la medicación del paciente");
                return;
            }

                const medicacionPac = respuesta.listaMedicacion;
                var listaMedicacion = document.getElementById("medicacionPac");
                listaMedicacion.innerHTML = "";
             
                for (var i = 0; i < medicacionPac.length; i++){
                    
                    listaMedicacion.innerHTML += "<li> Id: " + medicacionPac[i].medicamento + " <button onclick='verTomas(" + idPaciente + ", " +  medicacionPac[i].medicamento + ")'>Ver Toma</button>" + "</li>" +
                    "<li> Fecha de asignación: " + medicacionPac[i].fecha_asignacion + "</li>" +
                    "<li> Dosis: " + medicacionPac[i].dosis + "</li>" +
                    "<li> Tomas: " + medicacionPac[i].tomas + "</li>" +
                    "<li> Frecuencia: " + medicacionPac[i].frecuencia + "</li>" +
                    "<li> Observaciones: " + medicacionPac[i].observaciones + "</li>" ;

                }

    });
    
}

//permite actualizar los datos del paciente en el expediente del médico
function actualizarDatosPaciente(idPaciente){
    var pacienteActualizado = {
        id : idPaciente,
        nombre : document.getElementById("nombreActualizado").value,
        apellidos : document.getElementById("apellidosActualizado").value,
        fecha_nacimiento : document.getElementById("fechaActualizado").value,
        genero : document.getElementById("generoActualizado").value,
        codigo_acceso : document.getElementById("codigoActualizado").value,
        observaciones : document.getElementById("observacionesActualizado").value
    }
    rest.put("http://localhost:3000/api/paciente/" + idPaciente, pacienteActualizado, function(estado, respuesta){
        if(estado == 200){
            verExpediente(idPaciente);
            document.getElementById("nombreActualizado").value = ""; 
            document.getElementById("apellidosActualizado").value = "";
            document.getElementById("fechaActualizado").value = "";
            document.getElementById("generoActualizado").value = "";
            document.getElementById("codigoActualizado").value = "";
            document.getElementById("observacionesActualizado").value = "";
        }else{
            alert("Error modificando los datos del paciente");
        }

    }) ;

}




//AÑADE MEDICACIÓN A UN PACIENTE --> hacer el select y controlar que un medicamento solo puede aparecer una vez en un paciente
function anyadirMedicacion(){
    const idPaciente = idPacienteGL;
    var nuevaMedicacion ={
        medicamento : parseInt(document.getElementById("nombreMed").selectedIndex)+1,
        fecha_asignacion : document.getElementById("fechaAsigMed").value,
        dosis: document.getElementById("dosisMed").value,
        tomas: document.getElementById("tomasMed").value , 
        frecuencia: document.getElementById("frecuenciaMed").value ,
        observaciones: document.getElementById("observacionesMed").value

    };
    console.log(nuevaMedicacion);
    console.log("ID paciente" , idPaciente)
    rest.post("http://localhost:3000/api/paciente/" + idPaciente + "/medicacion", nuevaMedicacion, async function(estado, respuesta){
        console.log("Respuesta", respuesta)
        if(estado == 201){
            console.log("SE PASA POR VerExpediente");
            //verExpediente(idPaciente);
            document.getElementById("nombreMed").value = "Seleccione un medicamento"; // --> Me lo pone en blanco y no me escribe eso
            document.getElementById("fechaAsigMed").valueAsDate = new Date();
            document.getElementById("dosisMed").value = "";
            document.getElementById("tomasMed").value = "";
            document.getElementById("frecuenciaMed").value = "";
            document.getElementById("observacionesMed").value = "";
            verExpediente(idPaciente)
        } else if(estado==404) {
            alert(JSON.parse(respuesta).desc);
        }
        else{
            alert("Error introduciendo medicación");
        }
    })
    
}



//al pulsar sobre un medicamento, se podrá ver las tomas
function verTomas(idPaciente, idMedicamento){

    rest.get("http://localhost:3000/api/paciente/"+ idPaciente + "/medicacion/" + idMedicamento, function(estado, respuesta){
        console.log("Estado" , estado, "Toma" , respuesta);
        if (estado != 200){
            console.log("Error cargando la toma del paciente");
            return;
        }
        console.log("respuesta", respuesta)
        const tomaPac = respuesta.tomasPaciente;
        var tomasPaciente = document.getElementById("tomasPac");
        tomasPaciente.innerHTML = "";
        for (var i = 0; i < tomaPac.length; i++){
            tomasPaciente.innerHTML += 
            "<p> Toma:" + "</p>"+ 
            "<li> Id Medicación: " + tomaPac[i].medicamento + "</li>" +
            "<li> Id Paciente: " + tomaPac[i].paciente + "</li>" +
            "<li> Fecha: " + tomaPac[i].fecha + "</li>" ;
        }

        

    })
   

}




//SALIR DE LA APLICACIÓN --> NECESITO TENER LA FUNCION CAMBIAR SECCION QUE DIO EL PROFESOR
function salir(){
    cambiarSeccion("login");
}


