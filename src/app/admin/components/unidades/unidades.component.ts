import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

declare var $: any;

// Servicios
import { UnidadService } from '../../services/unidad.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

// Modelos
import { Unidad } from 'app/admin/models/unidad';

// Iconos
import { faPlus, faPen, faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit, OnDestroy {

  //Iconos
  faPlus = faPlus;
  faPen =  faPen;
  faSyncAlt = faSyncAlt;
  faExclamation = faExclamation;

  unidad = new Unidad();
  unidadT = new Unidad();
  cargarUnidades = true;
	public unidades: Unidad[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private unidadService: UnidadService, private swal: ShowMessagesService) { }

  ngOnInit() {
    this.getUnidades();
  }

  getUnidades() {
    this.unidadService.getUnidades()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((unidades)=>{
      this.cargarUnidades = false;
      this.unidades = unidades;
    });
  }

  guardarUnidad(form: NgForm) {
    if(form.invalid) {return;}
    $('#unidadModal').modal('hide');
    this.unidadService.addUnidad(this.unidad).then(()=>{
      form.resetForm();
    }).catch(()=>{
      this.swal.showErrorMessage('');
    });
  }

  cerrarModal(form: NgForm) {
    form.resetForm();
    $('#unidadModal').modal('hide');
  }

  abrirModal(unidad: Unidad){
    this.unidadT = unidad;
    $('#updateUnidadModal').modal('show');
  }

  cerrarModalUpdate(form: NgForm) {
    $('#updateUnidadModal').modal('hide');
  }

  actualizarUnidad(form: NgForm) {
    if(form.invalid) {return;}
    $('#updateUnidadModal').modal('hide');
    this.unidadService.updateUnidad(this.unidadT).then(()=>{
      this.swal.showSuccessMessage('');
    }).catch(()=>{
      this.swal.showErrorMessage('');
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
