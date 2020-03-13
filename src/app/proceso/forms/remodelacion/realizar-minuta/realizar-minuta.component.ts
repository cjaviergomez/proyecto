import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { Observable } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Solicitud } from '../../../../solicitudes/models/solicitud';

//Para subir los archivos
import { AngularFireStorage } from '@angular/fire/storage';

//Services
import { CamundaRestService } from 'app/proceso/services/camunda-rest.service';
import { SolicitudService } from 'app/solicitudes/services/solicitud.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';
import { UsuarioService } from 'app/admin/services/usuario.service';
import { AuthService } from 'app/out/services/auth.service';

@Component({
  selector: 'app-realizar-minuta',
  templateUrl: './realizar-minuta.component.html',
  styleUrls: ['./realizar-minuta.component.css']
})
export class realizarMinutaComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {

  solicitud: Solicitud;
  interventorId: string;

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
              storage: AngularFireStorage) {
    super(route, router, camundaRestService, solicitudService, swal, usuarioService, authService, storage);
  }

  ngOnInit() {
    this.metodoInicial();
    this.getSolicitud();
  }

  getSolicitud(){
    this.solicitudService.getSolicitudProcess(this.procesoId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(solicitud => {
          this.solicitud = solicitud[0];
        });
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
      this.solicitud.nombreMinuta = this.nameDocUp;
    }
    const filePath = `docs/${this.solicitud.id}/minuta_${id}`;
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
              this.solicitud.urlMinuta = url;
              this.solicitud.nombreMinuta = this.nameDocUp;
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
      title: '¿Está seguro que quiere terminar la tarea?',
      text: `Después de continuar no podrá volver actualizar la minuta`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp =>{
      if(resp.value) {
        const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
        this.completeTask(variables);
      }
    });
  }

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
      }
    };
    return variables;
  }

  getVariables(variables){
    for(let variable of variables){
      if(variable.name == 'interventorId'){
        this.interventorId = variable.value;
      }
    }
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
