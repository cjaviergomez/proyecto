import { Component, OnInit } from '@angular/core';
// Servicios
import { ReformaService } from '../services/reforma.service';
// Modelos
import { Reforma } from '../models/reforma';
// Iconos
import { faSearchPlus, faExclamation} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'reformas-list',
	templateUrl: '../views/reformas-list.html',
	providers: [ReformaService]
})

export class ReformasListComponent implements OnInit {
	public titulo = 'Reformas';
  public reformas: Reforma[];
  cargando = false;
  // Icons
  faSearchPlus = faSearchPlus; // Icono a implementar en el botón de borrar.
  faExclamation = faExclamation; // Icono de exclamación.

	constructor(private reformaService: ReformaService) {}

	ngOnInit() {
		this.getReformas();
	}

	//Metodo para obtener todas las Reformas usando el metodo getReformas del servicio.
	getReformas(){
    this.cargando = true;
		this.reformaService.getReformas().subscribe((reformas: Reforma[]) => {
      this.reformas = reformas;
      this.cargando = false;
    });
	}
}
