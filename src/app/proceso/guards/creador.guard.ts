import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

//Servicios
import { AuthService } from '../../out/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreadorGuard implements CanActivate {

  public isCreador: any = null;

  constructor(private auth: AuthService, private afsAuth: AngularFireAuth, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.afsAuth.authState
        .pipe(take(1))
        .pipe(map(authState => !!authState))
        .pipe(tap(auth => {
          this.auth.estaAutenticado().subscribe( user => {
            if(user){
              this.auth.isUserAdmin(user.uid).subscribe(userRole => {
                if(userRole){
                  this.isCreador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('creador');
                  if(!this.isCreador){
                    this.router.navigate(['/modIn/map']);
                  }
                }
              });
            } else if(!user) {
              this.router.navigate(['/modOut/login']);
            }
          });


        }));
    }

}
