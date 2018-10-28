var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChar', usuario, function(resp) {
        console.log('Usuarios conectados: ', resp);
    });

});



// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// escuchar informacion
socket.on('listaPersona', function(mensaje) {

    console.log(mensaje);

});

// mensajes privados
socket.on('mensajePrivado', function(personas) {

    console.log('Mensaje privado:', personas);

});

// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información