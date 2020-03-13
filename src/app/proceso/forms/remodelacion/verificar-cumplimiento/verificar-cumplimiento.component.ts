import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunTaskArchivosComponent } from '../../general/comun-task-archivos.component';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
declare var $: any; // Para trabajar con el modal
import Swal from 'sweetalert2';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'; // Iconos
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
  selector: 'app-verificar-cumplimiento',
  templateUrl: './verificar-cumplimiento.component.html',
  styleUrls: ['./verificar-cumplimiento.component.css']
})
export class verificarCumplimientoComponent extends ComunTaskArchivosComponent implements OnInit, OnDestroy {

  solicitud: Solicitud;

  docFinObra: boolean;
  comentariosActaFinObra: string[] = [];
  comentario: string;

  faTimes = faTimes;
  faCheck = faCheck;

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

  //Metodo para completar la tarea.
  completarTarea( valor: boolean){
    this.docFinObra = valor;
    if(this.docFinObra === true){
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea aceptar los datos y continuar?`,
        type: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp =>{
        if(resp.value) {
          const variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
          this.completeTask(variables);
        }
      });
    } else if(this.docFinObra === false){
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Está seguro que desea rechazar?`,
        type: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp =>{
        if(resp.value) {
          this.mostrarModal();
        }
      });
    }
  }

  mostrarModal(){
    $('#addComentario').modal('show');
  }

  enviarComentario(form: NgForm){
    if(form.invalid){return;}
    $('#addComentario').modal('hide');
    this.comentariosActaFinObra.push(this.comentario);
    form.resetForm();
    let variables = this.generateVariablesFromFormFields(); //Generamos las variables a enviar.
    this.completeTask(variables);
  }

  cerrarModal(form: NgForm){
    form.resetForm();
    $('#addComentario').modal('hide');
  }

  //Metodo para general las variables a guardar en camunda.
  generateVariablesFromFormFields() {
    const variables = {
      variables: {
        docFinObra: null,
        comentariosActaFinObra: null
      }
    };
    variables.variables.docFinObra = {
      value: this.docFinObra
    };
    variables.variables.comentariosActaFinObra = {
      value: this.comentariosActaFinObra
    };

    return variables;
  }

  getVariables(variables){
    for(let variable of variables){
      if(variable.name == 'comentariosActaFinObra'){
        this.comentariosActaFinObra = variable.value;
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
