import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

// Services
import { CamundaRestService } from '../../services/camunda-rest.service';
import { AuthService } from '../../../out/services/auth.service';

@Component({
  selector: 'app-processlist',
  templateUrl: './processlist.component.html',
  styleUrls: ['./processlist.component.css']
})
export class ProcesslistComponent implements OnInit, OnDestroy {

  public processDefinitions;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public isCreador: any = null;

  constructor(private camundaRestService: CamundaRestService,
              private route: ActivatedRoute,
              private auth: AuthService) { }

  ngOnInit() {
    const idCapa = this.route.snapshot.paramMap.get('idCapa'); // Se obtiene el id por la url
    const edif = this.route.snapshot.paramMap.get('edif'); // Se obtiene el id por la url
    const subCapa = this.route.snapshot.paramMap.get('subCapa');
    const elem = this.route.snapshot.paramMap.get('elem');
    const piso = this.route.snapshot.paramMap.get('piso');
    console.log(idCapa, edif, subCapa, elem, piso);
    this.getCurrentUser();
    this.getProcessDefinitions();
  }

  getProcessDefinitions(): void {
    this.camundaRestService
      .getProcessDefinitions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((processDefinitions) => {
        processDefinitions.shift();
        this.processDefinitions = processDefinitions;
      });
  }

  // Metodo para saber si hay un usuario logeado actualmente.
  getCurrentUser(){
    this.auth.estaAutenticado()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( user => {
      if(user){
        this.auth.isUserAdmin(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(userRole => {
          if(userRole){
            this.isCreador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('creador');
          }
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
