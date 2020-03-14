import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicios
import { ReformaService } from '../../services/reforma.service';

// Modelos
import { Reforma } from 'app/reformas/models/reforma';

// Iconos
import { faSearchPlus, faExclamation, faSyncAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'reformas-list',
  templateUrl: './reformas-list.component.html',
  styleUrls: ['./reformas-list.component.css']
})

export class ReformasListComponent implements OnInit, OnDestroy {

	public titulo = 'Reformas';
  public reformas: Reforma[];
  cargando = false;
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  // Icons
  faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
  faExclamation = faExclamation; // Icono de exclamación.
  faSyncAlt = faSyncAlt; // Icono que da vueltas al cargar.

	constructor(private reformaService: ReformaService) {}

	ngOnInit() {
		this.getReformas();
	}

	//Metodo para obtener todas las Reformas usando el metodo getReformas del servicio.
	getReformas(){
    this.cargando = true;
    this.reformaService.getReformas()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((reformas: Reforma[]) => {
      this.reformas = reformas;
      this.cargando = false;
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
