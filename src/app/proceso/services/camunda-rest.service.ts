import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Modelos
import { ProcessDefinition } from '../models/ProcessDefinition';
import { Task } from '../models/Task';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class CamundaRestService {

  private engineRestUrl = '/engine-rest/'

  constructor(private http: HttpClient) {}

  // Metodo para obtener todas las tareas
  getTasks(): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?sortBy=created&sortOrder=desc&maxResults=10`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  // Metodo para obtener las tareas de un proceso en especifico.
  getTasksProcess(idProcess: string): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}task?processInstanceId=${idProcess}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  // Metodo para obtener las tareas completadas de un proceso en especifico.
  getTasksProcessComplete(idProcess: string): Observable<Task[]> {
    const endpoint = `${this.engineRestUrl}/history/task?processInstanceId=${idProcess}&finished=true`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched tasks completed`)),
      catchError(this.handleError('getTasks', []))
    );
  }

  // Metodo para obtener todas las variables de un proceso terminado en especifico.
  getHistoryVariables(idProcess: string): Observable<[]> {
    const endpoint = `${this.engineRestUrl}/history/variable-instance?processInstanceId=${idProcess}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched History Variables`)),
      catchError(this.handleError('getHistoryVariables', []))
    );
  }

  // Metodo para obtener el formKey de una tarea
  getTaskFormKey(taskId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched taskform`)),
      catchError(this.handleError('getTaskFormKey', []))
    );
  }

  getVariablesForTask(taskId: String, variableNames: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/form-variables?variableNames=${variableNames}`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError('getVariablesForTask', []))
    );
  }

  // Metodo para completar las tareas con variables.
  postCompleteTask(taskId: String, variables: Object): Observable<any> {
    const endpoint = `${this.engineRestUrl}task/${taskId}/complete`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(tasks => this.log(`posted complete task`)),
      catchError(this.handleError('postCompleteTask', []))
    );
  }

  getProcessDefinitionTaskKey(processDefinitionKey): Observable<any> {
    const url = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/startForm`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched formkey`)),
      catchError(this.handleError('getProcessDeifnitionFormKey', []))
    );
  }

  // Metodo para obtener todos los procesos almacenados en camunda.
  getProcessDefinitions(): Observable<ProcessDefinition[]> {
    return this.http.get<ProcessDefinition[]>(this.engineRestUrl + 'process-definition?latestVersion=true').pipe(
      tap(processDefinitions => this.log(`fetched processDefinitions`)),
      catchError(this.handleError('getProcessDefinitions', []))
    );
  }

  // Metodo para obtener todas las variables que han sido guardadas en las instancias de un proceso activo.
  getVariablesForProcess(processId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-instance/${processId}/variables?deserializeValues=false`;
    return this.http.get<any>(endpoint).pipe(
      tap(form => this.log(`fetched variables`)),
      catchError(this.handleError('getVariablesForTask', []))
    );
  }

  // Metodo para crear una nueva instancia de un proceso.
  postProcessInstance(processDefinitionKey, variables): Observable<any> {
    const endpoint = `${this.engineRestUrl}process-definition/key/${processDefinitionKey}/start`;
    return this.http.post<any>(endpoint, variables).pipe(
      tap(processDefinitions => this.log(`posted process instance`)),
      catchError(this.handleError('postProcessInstance', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
