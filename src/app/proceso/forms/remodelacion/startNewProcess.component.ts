import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
declare var $: any; // Para trabajar con el modal

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

import { faWindowClose, faSearch, faPlus, faExclamation } from '@fortawesome/free-solid-svg-icons'; // Iconos

@Component({
  selector: 'startNewProcess',
  templateUrl: './startNewProcess.component.html',
  styleUrls: []
})
export class startNewProcessComponent extends StartProcessInstanceComponent {
  submitted:boolean = false;
  model = new MyProcessData();
  material = new Material(); //Modelo del material a agregar a la base de datos.
  solicitud: Solicitud;
  faWindowClose = faWindowClose;
  faSearch = faSearch;
  faPlus = faPlus;
  faExclamation = faExclamation;

  constructor(route: ActivatedRoute, camundaRestService: CamundaRestService,
              authService: AuthService, usuarioService:UsuarioService,
              solicitudService: SolicitudService,
              unidadService: UnidadService,
              datePipe: DatePipe,
              materialService: MaterialesService,
              swal: ShowMessagesService) {
    super(route, camundaRestService, authService, usuarioService, solicitudService, unidadService, datePipe, materialService, swal);
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

  buscarEspecial() {
    if (this.filterEspecials.length === 0) {
      return;
    }
    this.swal.showLoading();
    this.materialService.getEspecial(this.filterEspecials).subscribe( elementos => {
      this.swal.stopLoading();
      this.especiales = elementos;
      $('#buscarEspeciales').modal('show');
    });
  }

  guardarMaterial(form: NgForm, flat: string) {
    console.log(flat);
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
      this.materialService.addElemento(this.material).then(()=>{
        form.resetForm();
        this.swal.stopLoading();
      }).catch(()=>{
        this.swal.stopLoading();
        this.swal.showErrorMessage('');
      });
    } else if(flat === 'especial'){
      $('#addEspecial').modal('hide');
      this.materialService.addEspecial(this.material).then(()=>{
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

  eliminarMaterial(index: number){
    this.materialesUsuario.splice(index, 1);
  }

}
