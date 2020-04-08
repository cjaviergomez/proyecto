import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

//Modelos
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
  selector: 'app-subir-conceptos',
  templateUrl: './subir-conceptos.component.html',
  styleUrls: ['./subir-conceptos.component.css']
})

export class subirConceptosComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {

  planeacionId: string = null;
  desiId: string = null;
  mantenimientoId: string = null;

  //Para trabajar con el documento1
  uploadPercent: Observable<number>;
  urlDoc: Observable<string>;
  nameDocUp: string;

  //Para trabajar con el documento2
  uploadPercent2: Observable<number>;
  urlDoc2: Observable<string>;
  nameDocUp2: string;

  //Para trabajar con el documento3
  uploadPercent3: Observable<number>;
  urlDoc3: Observable<string>;
  nameDocUp3: string;

  constructor(route: ActivatedRoute,
              router: Router,
              camundaRestService: CamundaRestService,
              solicitudService: SolicitudService,
              swal: ShowMessagesService,
              usuarioService: UsuarioService,
              authService: AuthService,
              storage: AngularFireStorage,
              notificacionService: NotificacionService) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService, storage, notificacionService);
  }

  ngOnInit() {
    this.metodoInicial();
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
      texto: 'Se ha completado una tarea del proceso al cual estás vinculado.',
      fecha: new Date(),
      task: this.task.name
    };

    this.notificacionService.notifyPlantaFisica(notificacionAvance);
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

  // Metodo para obtener las variables historicas que se van a usar.
  getVariables(variables) {
    for(let variable of variables){
      if(variable.name == 'planeacionId'){
        this.planeacionId = variable.value;
      } else if(variable.name == 'mantenimientoId'){
        this.mantenimientoId = variable.value;
      } else if(variable.name == 'desiId'){
        this.desiId = variable.value;
      }
    }
    this.cargando = false;
   }

   // Metodo para obtener las variables historicas que se van a usar.
  getVariables2(variables) {
    this.getVariables(variables);
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
      this.solicitud.nombreCTMT = this.nameDocUp;
    }
    const filePath = `docs/${this.solicitud.id}/conceptoMT_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlDoc = ref.getDownloadURL()))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  /**
   * Método para obtener toda la información del documento a cargar a Firestore
   * @param e evento que se activa al seleccion un documento
   */
  onUpload2(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    if(file){
      this.nameDocUp2 = file.name;
      this.solicitud.nombreCTDSI = this.nameDocUp2;
    }
    const filePath = `docs/${this.solicitud.id}/conceptoDSI_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent2 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlDoc2 = ref.getDownloadURL()))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  /**
   * Método para obtener toda la información del documento a cargar a Firestore
   * @param e evento que se activa al seleccion un documento
   */
  onUpload3(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    if(file){
      this.nameDocUp3 = file.name;
      this.solicitud.nombreCTPlaneacion;
    }
    const filePath = `docs/${this.solicitud.id}/conceptoPlaneacion_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent3 = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlDoc3 = ref.getDownloadURL()))
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  /**
   * Metodo para actualizar la url del archivo de MT
   */
  subirArchivo() {
    this.swal.showQuestionMessage('').then( resp => {
      if(resp.value){
        this.swal.showLoading();
        this.urlDoc
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(url => {
              this.solicitud.urlCTMT= url;
              this.solicitud.nombreCTMT = this.nameDocUp;
              this.solicitudService.updateSolicitud(this.solicitud);

              // Reiniciamos las variables.
              this.urlDoc = null;
              this.nameDocUp = null;

              this.swal.stopLoading();
            });
      }
    });
  }

  /**
   * Metodo para actualizar la url del archivo de DSI
   */
  subirArchivo2() {
    this.swal.showQuestionMessage('').then( resp => {
      if(resp.value){
        this.swal.showLoading();
        this.urlDoc2
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(url =>{
              this.solicitud.urlCTDSI = url;
              this.solicitud.nombreCTDSI = this.nameDocUp2;
              this.solicitudService.updateSolicitud(this.solicitud);

              // Reiniciamos las variables.
              this.urlDoc2 = null;
              this.nameDocUp2 = null;

              this.swal.stopLoading();
            });
      }
    });

  }

  /**
   * Metodo para actualizar la url del archivo de Planeación
   */
  subirArchivo3() {
    this.swal.showQuestionMessage('').then( resp => {
      if(resp.value){
        this.swal.showLoading();
        this.urlDoc3
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(url =>{
              this.solicitud.urlCTPlaneacion = url;
              this.solicitud.nombreCTPlaneacion = this.nameDocUp3;
              this.solicitudService.updateSolicitud(this.solicitud);

              // Reiniciamos las variables.
              this.urlDoc3 = null;
              this.nameDocUp3 = null;

              this.swal.stopLoading();
            });
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
