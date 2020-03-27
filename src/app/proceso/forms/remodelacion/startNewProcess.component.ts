import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { takeUntil, finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
declare var $: any; // Para trabajar con el modal
import { AngularFireStorage } from '@angular/fire/storage';

// Componentes
import { StartProcessInstanceComponent } from '../general/start-process-instance.component'

// Modelos
import { MyProcessData } from '../../models/MyProcessData';
import { Solicitud } from 'app/solicitudes/models/solicitud';
import { Material } from '../../models/material';

// Servicios
import { SolicitudService } from '../../../solicitudes/services/solicitud.service';
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { CamundaRestService } from '../../services/camunda-rest.service';
import { UnidadService } from '../../../admin/services/unidad.service';
import { MaterialesService } from 'app/proceso/services/materiales.service';
import { ShowMessagesService } from 'app/out/services/show-messages.service';

import { faWindowClose, faSearch, faPlus, faExclamation, faArrowCircleRight, faArrowCircleLeft, faSave, faSyncAlt } from '@fortawesome/free-solid-svg-icons'; // Iconos

@Component({
  selector: 'startNewProcess',
  templateUrl: './startNewProcess.component.html',
  styleUrls: []
})
export class startNewProcessComponent extends StartProcessInstanceComponent implements OnDestroy {
  submitted = false;
  model = new MyProcessData([], [], [], '', false);
  material = new Material(); //Modelo del material a agregar a la base de datos.
  elementoPro = new Material(); //Modelo del elemento de protección a agregar a la base de datos.
  especial = new Material(); //Modelo de la accion especial a agregar a la base de datos.
  solicitud: Solicitud;

  descripcionS = '';
  faWindowClose = faWindowClose;
  faSearch = faSearch;
  faPlus = faPlus;
  faExclamation = faExclamation;
  faArrowCircleRight = faArrowCircleRight; // Flecha del botón siguiente.
  faArrowCircleLeft = faArrowCircleLeft; // Flecha del botón atrás
  faSave = faSave;
  faSyncAlt = faSyncAlt;

  //Para trabajar con el documento1
  uploadPercent: Observable<number>;
  urlDoc: Observable<string>;
  nameDocUp: string;

  storage: AngularFireStorage;

  public ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute, camundaRestService: CamundaRestService,
              authService: AuthService, usuarioService:UsuarioService,
              solicitudService: SolicitudService,
              unidadService: UnidadService,
              datePipe: DatePipe,
              materialService: MaterialesService,
              swal: ShowMessagesService,
              storage: AngularFireStorage) {
    super(route, camundaRestService, authService, usuarioService, solicitudService, unidadService, datePipe, materialService, swal);
    this.storage = storage;
  }

  buscarMateriales() {
    if (this.filterPost.length === 0) {
      return;
    }
    this.swal.showLoading();
    this.materialService.getMaterial(this.filterPost).subscribe( materiales => {
      this.swal.stopLoading();
      this.materiales = materiales;
      $('#buscarMaterial').modal('show');
    });
  }

  buscarElementos() {
    if (this.filterElements.length === 0) {
      return;
    }
    this.swal.showLoading();
    this.materialService.getElemento(this.filterElements).subscribe( elementos => {
      this.swal.stopLoading();
      this.elementosPro = elementos;
      $('#buscarElementos').modal('show');
    });
  }

  buscarEspeciales() {
    if (this.filterEspecials.length === 0) {
      return;
    }
    this.swal.showLoading();
    this.materialService.getEspecial(this.filterEspecials).subscribe( especiales => {
      this.swal.stopLoading();
      this.especiales = especiales;
      $('#buscarEspeciales').modal('show');
    });
  }

  guardarMaterial(form: NgForm, flat: string) {
    if(form.invalid) {return;}
    this.swal.showLoading();

    if(flat === 'material'){
      $('#addMaterial').modal('hide');
      this.materialService.addMaterial(this.material).then(()=>{
        form.resetForm();
        this.swal.stopLoading();
      }).catch(()=>{
        this.swal.stopLoading();
        this.swal.showErrorMessage('');
      });
    } else if(flat === 'elemento'){
      $('#addElemento').modal('hide');
      this.materialService.addElemento(this.elementoPro).then(()=>{
        form.resetForm();
        this.swal.stopLoading();
      }).catch(()=>{
        this.swal.stopLoading();
        this.swal.showErrorMessage('');
      });
    } else if(flat === 'especial'){
      $('#addEspecial').modal('hide');
      this.materialService.addEspecial(this.especial).then(()=>{
        form.resetForm();
        this.swal.stopLoading();
      }).catch(()=>{
        this.swal.stopLoading();
        this.swal.showErrorMessage('');
      });
    }
  }

  cerrarModalMaterial(form: NgForm, flat: string) {
    form.resetForm();
    if(flat === 'elemento'){
      $('#addElemento').modal('hide');
    } else if(flat === 'material'){
      $('#addMaterial').modal('hide');
    } else if(flat === 'especial'){
      $('#addEspecial').modal('hide');
    }
  }

  nuevoMaterial(flat: string){
    if(flat === 'material'){
      $('#addMaterial').modal('show');
    } else if(flat === 'elemento'){
      $('#addElemento').modal('show');
    } else if(flat === 'especial'){
      $('#addEspecial').modal('show');
    }
  }

  addMaterial(elemento: Material, flat: string) {
    if(flat === 'materiales'){
      this.materialesUsuario.push(elemento);
    } else if(flat === 'elementos'){
      this.elementosUsuario.push(elemento);
    } else if(flat === 'especiales') {
      this.especialesUsuario.push(elemento);
    }
  }

  eliminarMaterial(index: number, flat: string){
    if(flat === 'material'){
      this.materialesUsuario.splice(index, 1);
    } else if(flat === 'elemento'){
      this.elementosUsuario.splice(index, 1);
    } else if(flat === 'especial'){
      this.especialesUsuario.splice(index, 1);
    }
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
    }
    const filePath = `docs/solicitudes/${this.usuario.nombres}/${id}_${this.nameDocUp}`;
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
              this.url = url;
              this.name = this.nameDocUp;

              // Reiniciamos las variables.
              this.urlDoc = null;
              this.nameDocUp = null;

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
