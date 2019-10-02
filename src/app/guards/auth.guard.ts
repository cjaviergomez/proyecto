import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  userlogged: boolean;

  constructor( private auth: AuthService,
               private router: Router) {}

  canActivate(): boolean  {

    this.auth.estaAutenticado().subscribe( user => {
      if (user) {
         this.userlogged = true;
      } else {
        this.userlogged = false;
      }
    });

    if ( this.userlogged ) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }

  }

}
