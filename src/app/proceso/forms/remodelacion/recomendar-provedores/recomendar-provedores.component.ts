import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Modelos
import { Notificacion } from 'app/in/models/notificacion';

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';
import { NotificacionService } from 'app/proceso/services/notificacion.service';

@Component({
  selector: 'app-recomendar-provedores',
  templateUrl: './recomendar-provedores.component.html',
  styleUrls: ['./recomendar-provedores.component.css']
})
export class recomendarProveedoresComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {

  //Para trabajar con el documento1
  uploadPercent: Observable<number>;
  urlDoc: Observable<string>;
  nameDocUp: string;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              storage: AngularFireStorage,
              private notificacionService: NotificacionService) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService, storage);
  }

  ngOnInit() {
    this.metodoInicial();
  }

  /**
   * Método para obtener toda la información del documento a cargar a Firestore
   * @param e evento que se activa al seleccion un documento
   */
  onUpload(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    if(file){
      this.nameDocUp = file.name;
      this.solicitud.nombreProveedores = this.nameDocUp;
    }
    const filePath = `docs/${this.solicitud.id}/proveedores_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlDoc = ref.getDownloadURL()))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  /**
   * Metodo para actualizar la url del archivo de cotizacion
   */
  subirArchivo() {
    this.swal.showQuestionMessage('').then( resp => {
      if(resp.value){
        this.swal.showLoading();
        this.urlDoc
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(url => {
              this.solicitud.urlProveedores = url;
              this.solicitud.nombreProveedores = this.nameDocUp;
              this.solicitudService.updateSolicitud(this.solicitud);

              // Reiniciamos las variables.
              this.urlDoc = null;
              this.nameDocUp = null;

              this.swal.stopLoading();
            });
      }
    });
  }

   //Metodo para completar la tarea.
   completarTarea(){
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea continuar?`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp =>{
      if(resp.value) {
        const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
        this.enviarNotificaciones();
        this.completeTask(variables);
      }
    });
  }

  /**
   * Metodo para enviar las respectivas notificaciones a cada uno de los actores del proceso
   * segùn la tarea.
   */
  enviarNotificaciones() {
    //Notificar el avance en el proceso.
    let notificacionAvance: Notificacion;
    const id = Math.random().toString(36).substring(2);

    notificacionAvance = {
      id: id,
      leido: false,
      solicitudId: this.solicitud.id,
      texto: 'ha completado una tarea del proceso al cual estás vinculado.',
      actor: this.usuario.perfil.nombre,
      fecha: new Date()
    };
    this.notificacionService.notifyPlaneacion(notificacionAvance);
    if(this.solicitud.usuario.perfil.nombre !== 'Planta Física'){
      this.notificacionService.notifyUsuario(notificacionAvance, this.solicitud.usuario);
    }
  }

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
      }
    };
    return variables;
  }

  getVariables(){
    this.cargando = false;
  }

  getVariables2(){
    this.cargando = false;
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
