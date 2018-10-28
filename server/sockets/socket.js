const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesario'
            });
        }


        client.join(data.sala);

        let personas = usuarios.agregarPersonas(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió al chat`));

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('disconnect', () => {
        let personasBorrada = usuarios.borrarPersona(client.id);
        if (personasBorrada) {
            client.broadcast.to(personasBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personasBorrada.nombre } abandonó el chat`));
            client.broadcast.to(personasBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personasBorrada.sala));
        }
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    // mensajes privados
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });


});