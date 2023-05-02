

var medicos = [
    { id: 1, nombre: "Belén", apellidos:"Pérez Jiménez" , login: "belen3", password: "1"},
    { id: 2, nombre: "Clara", apellidos: "Jiménez Martínez", login: "clara4",  password: "2"},
    { id: 3, nombre: "Jose", apellidos: "Andrade Restrepo", login: "jose12", password: "3"},
];
var siguienteMedico = 4;

var pacientes = [
    {id:1, nombre:"Álvaro", apellidos:"Valdés Lizón",  fecha_nacimiento:"2000-03-11", 
    genero:'H', medico:1, codigo_acceso:"AL87", observaciones:"Hipertensión"},
    {id:2, nombre:"Pepe", apellidos:"García Terres", fecha_nacimiento:"1998-09-25", 
    genero:'H', medico:1, codigo_acceso:"PE90", observaciones:"Depresión y TCA"},
    {id:3, nombre:"Marta", apellidos:"Gómez López",  fecha_nacimiento:"1976-08-18", 
    genero:'M', medico:2, codigo_acceso:"MA87", observaciones:"Esclerosis Múltiple"},
    {id:4, nombre:"Rocío",apellidos:"Nuñez Campos", fecha_nacimiento:"1985-12-04", 
    genero:'M', medico:3, codigo_acceso:"RO94", observaciones:"Rotura de cadera"},
];
var siguientePaciente = 5;

var medicamento = [
    {id:1, nombre:"Paracetamol", descripcion:"Analgésico y antipirético ", num_dosis:30 , importe:5, importe_subvencionado: 1},
    {id:2, nombre:"Tramadol", descripcion:"analgésico opioide débil", num_dosis: 20, importe:22 , importe_subvencionado:5 },
    {id:3, nombre:"Dafiro", descripcion:"trata la hipertensión", num_dosis: 10 , importe: 7, importe_subvencionado:3 },
    {id:4, nombre:"Diazepam", descripcion:"benzodiazepina", num_dosis: 14 , importe: 5, importe_subvencionado: 2},
];
var siguienteMedicamento = 5;

var medicacion = [
    {medicamento:1, paciente: 3, fecha_asignacion:"2022-10-07", dosis: 1, tomas: 3, frecuencia: 1, observaciones: "Tomar con el estómago lleno"  },
    {medicamento:2, paciente: 2, fecha_asignacion:"2021-05-19", dosis: 1, tomas: 1, frecuencia: 1, observaciones: "Tomar por la mañana" },
]; 
var siguienteMedicacion = 3;

var tomas = [
    {medicamento: 2, paciente:2, fecha:'2020-12-17T08:00:00'},
    {medicamento: 2, paciente:2, fecha:'2021-10-17T14:00:00'},
    {medicamento: 2, paciente:2, fecha:'2023-04-29T14:00:00'},
    {medicamento: 1, paciente: 3, fecha:'2023-02-13T10:30:00'},
];
var siguienteToma =  4; 

module.exports.medicos=medicos;
module.exports.pacientes=pacientes;
module.exports.medicamento=medicamento;
module.exports.medicacion=medicacion;
module.exports.tomas=tomas;

module.exports.siguienteMedico=siguienteMedico;
module.exports.siguientePaciente=siguientePaciente;
module.exports.siguienteMedicamento=siguienteMedicamento;
module.exports.siguienteMedicacion=siguienteMedicacion;
module.exports.siguienteToma=siguienteToma;