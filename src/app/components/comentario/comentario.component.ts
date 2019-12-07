import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Modelos
import { Mensaje } from '../../models/mensaje';

// Servicios
import { MensajesService } from '../../services/mensajes.service';
import { ShowMessagesService } from '../../services/show-messages.service';

// Iconos
import { faExclamation, faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit, OnDestroy {

  comentario: Mensaje;
  cargando = false;
  private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables

  // Iconos
  faExclamation = faExclamation; // Icono de exclamación.
  faSyncAlt = faSyncAlt; // Icono que gira al cargar los datos.
  faTrash = faTrash; // Icono de eliminar.

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mensajeServices: MensajesService,
              private swal: ShowMessagesService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Se obtiene el id por la url

    this.cargando = true;
    this.mensajeServices.getMensaje(id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((mensaje: Mensaje) => {
      // Obtenemos la informacion del usuario de la base de datos de firebase.
      this.comentario = mensaje;
      this.cargando = false;
      this.updateComentario(this.comentario);
    });

  }

  eliminarMensaje(id: string){
    this.swal.showQuestionMessage('deleteComment').then(resp => {
      if(resp.value){
        this.swal.showLoading();
        this.mensajeServices.deleteMensaje(id).then(()=>{
          this.swal.stopLoading();
          this.router.navigate(['/comentarios'])
        });
      }
    });
  }

  updateComentario(comentario: Mensaje){
    if(comentario.estado === 'Pendiente'){
      comentario.estado = 'Leido';
      this.mensajeServices.updateMensaje(comentario);
    }
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
