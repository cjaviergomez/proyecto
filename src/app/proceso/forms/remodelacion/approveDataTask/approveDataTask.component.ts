import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Componentes
import { CompleteTaskComponent } from '../../general/complete-task.component';

// Modelos
import { MyProcessData } from '../../../models/MyProcessData';
import { Task } from 'app/proceso/models/Task';
import { Solicitud } from 'app/solicitudes/models/solicitud';

// Services
import { CamundaRestService } from '../../../services/camunda-rest.service';
import { SolicitudService } from '../../../../solicitudes/services/solicitud.service';

@Component({
  selector: 'approveDataTask',
  templateUrl: './approveDataTask.component.html',
  styleUrls: []
})
export class approveDataTaskComponent extends CompleteTaskComponent implements OnDestroy {

  submitted = false;
  model = new MyProcessData([], [], [], '', false);
  public procesoId: string;
  public taskId: string;
  public task: Task;
  solicitud: Solicitud[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(route: ActivatedRoute,
    router: Router,
    camundaRestService: CamundaRestService,
    solicitudService: SolicitudService) {
    super(route, router, camundaRestService, solicitudService);
    this.route.params.subscribe(params => {
      this.procesoId = params['id'];
      this.taskId = params['taskId'];
      const variableNames = Object.keys(this.model).join(',');
      this.loadExistingVariables(this.taskId, variableNames);
    });
  }

   /**
   * Metodo para buscar una tarea en especifico.
   * @param id id de la tarea a consultar
   */
  getTask(id: string) {
    this.camundaRestService.getTask(id).subscribe( task => {
      this.task = task;
    });
  }

  /**
   * Metodo para obtener la solicitud asociada al proceso.
   */
  getSolicitud() {
    this.solicitudService.getSolicitudProcess(this.procesoId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( solicitud => {
          this.solicitud = solicitud;
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
