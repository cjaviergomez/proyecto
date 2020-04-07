export interface Notificacion {
  id?: string;
  texto?: string; //Mensaje a mostrar
  leido?: boolean; // Estado de la notificación
  solicitudId?: string; // Solicitud asociada a la notificación.
  actor?: string; //Nombre del usuario que genera la notificación.
  fecha?: Date; // Fecha de creación de la notificación.
  task?: string; //Nombre de la tarea que se completó.
}
