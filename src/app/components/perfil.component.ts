import { Component, OnInit } from '@angular/core';

//Servicios
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario';

@Component({
    selector: 'app-perfil',
    templateUrl: '../views/perfil.html',
    styleUrls: ['../../assets/css/perfil.css']
  })
export class PerfilComponent implements OnInit{

    usuario: Usuario = {
        nombres: '',
        correo: '',
        photoUrl: ''
    };

    public providerId: string = 'null';

    constructor(private authService: AuthService){}
    
    ngOnInit() {
        this.authService.estaAutenticado().subscribe( user => {
            if (user) {
                this.usuario.nombres = user.displayName;
                this.usuario.correo = user.email;
                this.usuario.photoUrl = user.photoURL;
                this.providerId = user.providerData[0].providerId;
                console.log(user);
            }
        });
    }

}