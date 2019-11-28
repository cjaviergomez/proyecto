import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

// Servicios
import { PerfilService } from '../../services/perfil.service';
import { UnidadService } from '../../services/unidad.service';

// Modelos
import { Perfil } from 'app/models/perfil';
import { Unidad } from 'app/models/unidad';

// Iconos
import { faPlus, faPen, faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info-admin',
  templateUrl: './info-admin.component.html',
  styleUrls: ['./info-admin.component.css']
})
export class InfoAdminComponent implements OnInit, OnDestroy {

  //Iconos
  faPlus = faPlus;
  faPen =  faPen;
  faSyncAlt = faSyncAlt;
  faExclamation = faExclamation;

  cargarPerfiles = true;
  unidad = new Unidad();
  cargarUnidades = true;
  public perfiles: Perfil[] = [];
	public unidades: Unidad[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private perfilService: PerfilService,
              private unidadService: UnidadService) { }

  ngOnInit() {
    this.getPerfiles();
    this.getUnidades();
  }

  getPerfiles() {
    this.perfilService.getPerfiles()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((perfiles)=>{
      this.cargarPerfiles = false;
      this.perfiles = perfiles;
    });
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
