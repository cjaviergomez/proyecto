import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para mostrar todos los mensajes en pantalla para el usuario.
 * Estos mensajes son generados con sweetalert2
 */
export class ShowMessagesService {

  constructor() { }

  showErrorMessage(code: string) {
    switch( code ){
      case 'auth/user-not-found': {
        Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: 'Correo no registrado. Por favor verifique que el correo sea el correcto o registrese.'
        });
        break;
      }
      case 'auth/wrong-password': {
        Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: 'Contraseña incorrecta. Intentelo de nuevo.'
        });
        break;
      }
      case 'auth/expired-action-code': {
        Swal.fire({
          type: 'error',
          title: 'Código Caducado',
          text: 'El codigo expiró. Por favor reestablezca la contraseña nuevamente'
        });
        break;
      }
      case 'auth/email-already-in-use': {
        Swal.fire({
          allowOutsideClick: false,
          type: 'error',
          title: 'Error al registrar',
          text: 'El correo ya esta en uso. Por favor intente con un correo diferente o inicie sesión.'
        });
        break;
      }
      case 'auth/invalid-action-code': {
        Swal.fire({
          allowOutsideClick: false,
          type: 'error',
          title: 'Código Inválido',
          text: 'El código suministrado es inválido.'
        });
        break;
      }
      case 'passActualError': {
        Swal.fire({
          type: 'error',
          title: 'Contraseña actual incorrecta',
          text: 'Por favor verifica que la contraseña actual sea correcta.'
        });
         break;
      }
      case 'noActiveError': {
        Swal.fire({
          type: 'error',
          title: 'Cuenta no activa',
          text: 'Por favor espere a que su cuenta sea activada por un administrador'
        });
         break;
      }
      case 'noEmailVerifiedError': {
        Swal.fire({
          type: 'error',
          title: 'Cuenta no verificada',
          text: 'Por favor ingresa a tu correo para verificar tu cuenta.'
        });
         break;
      }
      case 'passNoSameError': {
        Swal.fire({
          type: 'error',
          title: 'Las contraseñas con coinciden',
          text: 'Por favor verifica que las nuevas contraseñas coincidan.'
        });
         break;
      }
      case 'paramsNoFoundError': {
        Swal.fire({
          type: 'error',
          title: 'No existen los parámetros',
          text: 'No se encontraron los parámetros.'
        });
         break;
      }
      default: {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error inesperado. Inténtalo nuevamente'
        });
        break;
      }
    }

  }

  showSuccessMessage(code: string) {
    switch (code) {
      case 'sendMailSuccess': {
        Swal.fire({
          type: 'success',
          title: 'Correo enviado exitosamente',
          text: 'Por favor revisa tu correo'
        });
        break;
      }
      case 'updatePassSuccess': {
        Swal.fire({
          type: 'success',
          title: 'Contraseña actualizada',
          text: 'La contraseña se actualizó correctamente.'
        });
        break;
      }
      case 'createAccountSuccess': {
        Swal.fire({
          allowOutsideClick: false,
          type: 'success',
          title: 'Registro Exitoso',
          text: 'Te hemos enviado un correo. Por favor verifica tu correo y espera a que tu cuenta sea activada por un admin.'
        });
        break;
      }
      case 'sendMessage': {
        Swal.fire({
          allowOutsideClick: false,
          type: 'success',
          title: 'Mensaje enviado con éxito',
          text: 'Un administrador atenderá tu mensaje. Muchas gracias por usar este medio.'
        });
        break;
      }
      default: {
        Swal.fire({
          type: 'success',
          title: 'Éxito',
          text: 'La acción se realizó con éxito'
        });
        break;
      }
    }
  }

  showQuestionMessage(code: string, usuario?: Usuario, estado?: string) {
    switch (code) {
      case 'disableAccount': {
        return Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Estás seguro que deseas desactivar tu cuenta?`,
          type: 'question',
          showConfirmButton: true,
          showCancelButton: true
        });
      }
      case 'disableUserAccount': {
        let estadoInfinitivo: string;
        if ( estado == 'Desactivado'){
          estadoInfinitivo = 'desactivar';
        } else {
          estadoInfinitivo = 'activar';
        }
        return Swal.fire({
          title: '¿Está seguro?',
          text: `Está seguro que desea ${estadoInfinitivo} a ${ usuario.nombres }`,
          type: 'question',
          showConfirmButton: true,
          showCancelButton: true
        });
      }
    }
  }

  showEmailVerifiedMessage() {
    Swal.mixin({
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: false,
      allowOutsideClick: false,
      progressSteps: ['1', '2', '3', '4']
    }).queue([
      {
        title: 'Correo verificado',
        type: 'success',
        text: '¡Excelente! Has verificado tu correo.'
      },
      {
        title: 'Toma nota',
        type: 'info',
        text: 'Las siguientes credenciales las necesitarás para acceder al mapa del campus'
      },
      {
        title: 'Toma nota',
        type: 'info',
        html: `
        <pre><code>Usuario: carlos.gomez0</code></pre>
        <pre><code>Contraseña: carlos</code></pre>`
      },
      {
        title: 'Credenciales',
        type: 'info',
        text: 'Podrás consultar estás credenciales en cualquier momento desde la configuración de tu cuenta'
      }
    ]).then((result) => {
      if (result.value) {
        Swal.fire({
          title: '¡Bien hecho!',
          type: 'success',
          text: 'Tu correo ha sido verificado'
        });
      };
    });
  }

  showLoading() {
    Swal.fire({
			allowOutsideClick: false,
			type: 'info',
			text: 'Espere por favor...'
		});
		Swal.showLoading(); // Iniciamos el loading.
  }

  stopLoading() {
    Swal.close();  // Paramos el loading.
  }

}
