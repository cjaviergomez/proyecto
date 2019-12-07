import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

// Modelos
import { Mensaje } from '../../models/mensaje';

//Servicios
import { MensajesService } from '../../services/mensajes.service';
import { ShowMessagesService } from '../../services/show-messages.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnDestroy {

  mensaje: Mensaje = new Mensaje();
  fecha: string = new Date().toLocaleDateString();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public mensajes: Mensaje[] = [];
  yaEnvio = false;

  constructor(private mensajesService: MensajesService,
              private swal: ShowMessagesService) { }

  onSubmit(form: NgForm) {
    if(form.invalid) {return;}

    this.swal.showQuestionMessage('sendMessage')
    .then( resp => {
      if(resp.value) {
        this.swal.showLoading();
        this.mensajesService.getUserMessages(this.mensaje.correo)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(m => {
          this.mensajes = m;
          this.recorrerMensajes(this.mensajes);

          if(this.yaEnvio === false){

            this.mensaje.fecha = this.fecha;
            this.mensaje.estado = 'Pendiente';

            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();

            this.mensajesService.addMensaje(this.mensaje)
            .then(()=>{
              this.swal.stopLoading();
              this.swal.showSuccessMessage('sendMessage');
            }).catch((error)=>{
              this.swal.stopLoading();
              this.swal.showErrorMessage(error);
            });
          } else {
            this.swal.stopLoading();
            this.swal.showErrorMessage('noMoreMessages');
          }
        });
      }
    });

  }

  recorrerMensajes(mensajes: Mensaje[]){
    mensajes.forEach((mensaje)=>{
      if(mensaje.fecha === this.fecha){
        this.yaEnvio = true;
        return;
      }
    });
  }


  /**
   * Este metodo se ejecuta cuando el componente se destruye
   * Usamos este método para cancelar todos los observables.
   */
  ngOnDestroy(): void {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
