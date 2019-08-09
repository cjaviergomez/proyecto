import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public title:string = 'CampusGIS';

  constructor( public auth:AuthService){
  }

  ngOnInit() {
    // On initial load, set up local auth streams
    this.auth.localAuthSetup();
  }

  login(){
    this.auth.login();
  }

  salir(){
    this.auth.logout();
  }

}
