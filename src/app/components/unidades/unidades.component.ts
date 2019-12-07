import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

// Servicios
import { UnidadService } from '../../services/unidad.service';

// Modelos
import { Unidad } from 'app/models/unidad';

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
  cargarUnidades = true;
	public unidades: Unidad[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private unidadService: UnidadService) { }

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
    this.unidadService.addUnidad(this.unidad).then(()=>{
      //TODO: Falta cerrar el modal cuando se guarda la información.

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
