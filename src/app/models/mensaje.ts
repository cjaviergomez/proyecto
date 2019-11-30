// Modelo de los mensajes que los usuarios le envían al administrador.
export class Mensaje {
  id?: string;
  fecha: number;
  nombres: string;
  apellidos: string;
  correo:string;
  mensaje: string;
  estado: string;

  constructor(){}
}
