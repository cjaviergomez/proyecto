// Modelo de los mensajes que los usuarios le envían al administrador.
export class Mensaje {
  id?: string;
  fecha: string;
  nombres: string;
  apellidos: string;
  correo:string;
  mensaje: string;
  estado: string;  //EL mensaje va a tener dos estado: Pendiente y Leido.
                  // Pendiente: Tan pronto el usuario envía el comentario.
                  // Leido: Tan pronto el admin ve el mensaje.

  constructor(){}
}
