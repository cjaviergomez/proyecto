import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public title:string = 'CampusGIS';

  constructor(private auth: AuthService,
              private router: Router,
              private db: AngularFirestore){
  }

  ngOnInit() {
  }

  salir(){
    this.auth.logout();
    this.auth.leerToken();
    this.router.navigateByUrl('/login');
    }

}
