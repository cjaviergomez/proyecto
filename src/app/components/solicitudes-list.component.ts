import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Servicios
import { SolicitudService } from '../services/solicitud.service';

// Modelos
import { Solicitud } from '../models/solicitud';

// Iconos
import { faSearchPlus, faExclamation} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'solicitudes-list',
	templateUrl: '../views/solicitudes-list.html',
	providers: [SolicitudService]
})
export class SolicitudesListComponent implements OnInit, OnDestroy {

	public titulo = 'Solicitudes';
	public solicitudes: Solicitud[];
  cargando = false;
  private ngUnsubscribe = new Subject();
  // Icons
  faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
  faExclamation = faExclamation; // Icono de exclamación.

	constructor(private solicitudService: SolicitudService){}

	ngOnInit(){
		this.getSolicitudes();
	}

	//Metodo para obtener todas las solicitudes usando el metodo getSolicitudes del servicio.
	getSolicitudes(){
    this.cargando = true;
		this.solicitudService.getSolicitudes().pipe(
      takeUntil(this.ngUnsubscribe)
      ).subscribe( solicitudes => {
        this.solicitudes = solicitudes;
        this.cargando = false;
    });
	}

  onDeleteSolicitud(id:number){}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
	}

}
