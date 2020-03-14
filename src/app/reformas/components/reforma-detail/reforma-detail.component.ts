import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { faSyncAlt, faExclamation } from '@fortawesome/free-solid-svg-icons';

//Modelos
import { Reforma } from 'app/reformas/models/reforma';
// Services
import { ReformaService } from '../../services/reforma.service';


@Component({
  selector: 'app-reforma-detail',
  templateUrl: './reforma-detail.component.html',
  styleUrls: ['./reforma-detail.component.css']
})
export class ReformaDetailComponent implements OnInit, OnDestroy {

  public reforma: Reforma;
  cargando: boolean;
  private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables
  faSyncAlt = faSyncAlt;
  faExclamation = faExclamation;

	constructor(
		private reformaService: ReformaService,
		private route: ActivatedRoute
	){}

	ngOnInit(){
    this.cargando = true;
		this.getReforma();
	}

	getReforma(){
		this.route.params.forEach((params: Params) => {
			let id = params['id'];
      this.reformaService.getReforma(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( reforma  => {
        this.reforma = reforma;
        this.cargando = false;
      });
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
