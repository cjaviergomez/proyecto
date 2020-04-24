import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';

// Servicios
import { ReformaService } from '../../services/reforma.service';

// Modelos
import { Reforma } from 'app/reformas/models/reforma';

// Iconos
import { faSearchPlus, faExclamation, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

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

	//Para trabajar con las filtraciones desde el mapa.
	nombreEdificio;
	subCapa;
	objectoId;
	piso;

	reformas$;

	// Icons
	faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
	faExclamation = faExclamation; // Icono de exclamación.
	faSyncAlt = faSyncAlt; // Icono que da vueltas al cargar.

	constructor(private reformaService: ReformaService, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.forEach((params: Params) => {
			this.nombreEdificio = params['nombreEdificio'];
			this.subCapa = params['subCapa'];
			this.objectoId = params['objectoId'];
			this.piso = params['piso'];
		});
		this.getReformas();
	}

	//Metodo para obtener todas las Reformas usando el metodo getReformas del servicio.
	getReformas(): void {
		this.cargando = true;
		this.reformas$ = this.reformaService.getReformas().pipe(takeUntil(this.ngUnsubscribe));

		if (this.nombreEdificio && this.subCapa && this.objectoId && this.piso) {
			this.reformas$ = this.reformas$.pipe(
				map((reformas: Reforma[]) =>
					reformas.filter(
						(reforma) =>
							reforma.nombre_edificio === this.nombreEdificio &&
							reforma.nombre_subcapa === this.subCapa &&
							reforma.objectID === this.objectoId &&
							reforma.piso_edificio === this.piso
					)
				)
			);
		}

		this.reformas$.subscribe((reformas) => {
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
