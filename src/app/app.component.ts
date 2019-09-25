import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Servicios
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public title:string = 'CampusGIS';
  public islogged: boolean = false;

  constructor(private auth: AuthService,
              private router: Router){
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  //Metodo para cerrar la sesiòn de un usuario haciendo uso del servicio
  salir(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
    }

  //Metodo para saber si hay un usuario logeado actualmente.
  getCurrentUser(){
    this.auth.estaAutenticado().subscribe( auth=> {
      if(auth){
        this.islogged = true;
      } else {
        this.islogged = false;
      }
    });
  }

}
