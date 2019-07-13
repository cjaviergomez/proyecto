import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';  //Para trabajar con la API de ArcGIS
import esri = __esri;

import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title:string = 'CampusGIS';
  public header_color: string;

  constructor(){
  	this.header_color = GLOBAL.header_color;
  }

}
