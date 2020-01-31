/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Usuario } from 'app/admin/models/usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


// Servicios
import { UsuarioService } from '../../../admin/services/usuario.service';
import { AuthService } from '../../../out/services/auth.service';
import { ShowMessagesService } from '../../../out/services/show-messages.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class EsriMapComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject<any>();
  usuario = new Usuario();
  public isCreador: any = null;

  @Output() datos_formulario = new EventEmitter();
  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode', {static:true}) private mapViewEl: ElementRef;

  constructor(private usuarioService: UsuarioService,
              private authService: AuthService,
              private router: Router,
              private swal: ShowMessagesService) {}

  async initializeMap() {

    try {
      const [WebScene, FeatureLayer, SceneView, LayerList] = await loadModules([
        'esri/WebScene',
        'esri/layers/FeatureLayer',
        'esri/views/SceneView',
        'esri/widgets/LayerList'
      ]);

      var creador = this.isCreador;
      var router = this.router;
      //Estas variables tendran los datos que se le pasarán al formulario de la solicitud(Edificio, capa, objecto)
      var idCapa: string;
      var nombreEdificio: string;
      var subCapa: string;
      var objectoId;
      var piso;

      //Set the webscene
      const websceneProperties: esri.WebSceneProperties = {
        portalItem: {
            // autocasts as new PortalItem()
            id: '8505c0c388a64116813728e94530dfce'   //Web Scene con edificio de mecanica ArcGIS Pro 2.3
          }
      };

      const webScene: esri.WebScene = new WebScene(websceneProperties);

      // create the scene view
      const view = new SceneView({
        container: this.mapViewEl.nativeElement,
        map: webScene
      });

      // wait until the webscene finished loading
      webScene.when(function() {
        //Create label for all layer in the web scene
        webScene.layers.forEach(function(layer) {
          // Load all contained sublayers but ignore if one or more of them failed to load
          layer.load()
          .catch(function(error) {
              // Ignore any failed resources
            })
            .then(function() {
              var long = layer.fullExtent.center.longitude;
              var lat = layer.fullExtent.center.latitude;
              createLabel(layer, lat, long);
            });
        });

        // Defines an action to zoom out from the selected feature
        var solicitudAction = {
          // This text is displayed as a tooltip
          title: 'Solicitar',
          // The ID by which to reference the action in the event handler
          id: 'hacer-solicitud',
          // Sets the icon font used to style the action button
          className: 'esri-icon-add-attachment'
        };

        var verSolicitudesAction = {
          // This text is displayed as a tooltip
          title: 'Ver Solicitudes',
          // The ID by which to reference the action in the event handler
          id: 'ver-solicitudes',
          // Sets the icon font used to style the action button
          className: 'esri-icon-review'
        }

        var verReformasAction = {
          // This text is displayed as a tooltip
          title: 'Ver Reformas',
          // The ID by which to reference the action in the event handler
          id: 'ver-reformas',
          // Sets the icon font used to style the action button
          className: 'esri-icon-duplicate'
        }
        //Remove the firt action
        view.popup.actions.splice(0, 1);

        // Adds the custom action to the popup.
        if(creador){
          view.popup.actions.push(solicitudAction);
        }
        view.popup.actions.push(verSolicitudesAction);
        view.popup.actions.push(verReformasAction);

        // The function to execute when the solicitud action is clicked
        function irAlformulario() {
          router.navigate(['/modProceso/processlist', idCapa, nombreEdificio, subCapa, objectoId, piso]);
        }

        // The function to execute when the solicitud action is clicked
        function irASolicitudes() {
          router.navigate(['/modSolicitudes/solicitudes']);
        }

        function irAReformas(){
          router.navigate(['/modReformas/reformas']);
        }

        // This event fires for each click on any action
        view.popup.on('trigger-action', function(event){
          // If the zoom-out action is clicked, fire the zoomOut() function
          if(event.action.id === 'hacer-solicitud'){
            irAlformulario();
          }else if(event.action.id === 'ver-solicitudes'){
            irASolicitudes();
          }else if(event.action.id === 'ver-reformas'){
            irAReformas();
          }
        });

        view.popup.watch('selectedFeature', function(graphic:any) {
          if (graphic) {
            graphic.layer.allSublayers.forEach(function(layer:esri.Layer) {
              if(layer.title == graphic.attributes.BaseCategory){
                /* view.goTo({
                    target: graphic,
                    tilt: 60
                  },
                  {
                    duration: 1500,
                    easing: "out-expo"
                  }); */
                showInfo(graphic.layer, layer, graphic.attributes);
              }
            });
          }
        });

      });  //finished the webScene.when

      //Función que muestra la información del elemento seleccionado.
      function showInfo(edificio:any, layer:esri.Layer, elemento:any) {
        idCapa = edificio.id;
        nombreEdificio = edificio.title;
        subCapa = layer.title;
        objectoId = elemento.OBJECTID_1;
        piso = elemento.BldgLevel;
        console.log('Edicicación: ' + edificio.title + ' Capa: ' + layer.title + ' ElementoID: ' + elemento.OBJECTID_1);
      }

      //Función para crear el label al edificio.
      function createLabel(layer:esri.Layer, lat:number, long:number) {
        var features = [
          {
            attributes: {
              ObjectID: layer.id,
            },
            geometry: {
              type: 'point',
              x: long,
              y: lat
            }
          }
        ];
        var label = new FeatureLayer({
          source: features,  // autocast as a Collection of new Graphic()
          objectIdField: 'ObjectID',
          elevationInfo: {
            mode: 'relative-to-scene'
          },
          featureReduction: {
            type: 'selection'
          },
          returnZ: false,
          // Select peaks higher than 3000m
          definitionExpression: 'ObjectID > 0',
          title: '',
          // Set a renderer that will show the points with icon symbols
          renderer: {
            type: 'simple', // autocasts as new SimpleRenderer()
            symbol: {
              type: 'point-3d', // autocasts as new PointSymbol3D()
              symbolLayers: [
                {
                  type: 'icon', // autocasts as new IconSymbol3DLayer()
                  resource: {
                    primitive: 'circle'
                  },
                  material: {
                    color: 'black'
                  },
                  size: 5
                }
              ]
            }
          },
          outFields: ['*'],
          // Add labels with callouts of type line to the icons
          labelingInfo: [
            {
              // When using callouts on labels, "above-center" is the only allowed position
              labelPlacement: 'above-center',
              labelExpressionInfo: {
                value: layer.title  //Titulo del label
              },
              symbol: {
                type: 'label-3d', // autocasts as new LabelSymbol3D()
                symbolLayers: [
                  {
                    type: 'text', // autocasts as new TextSymbol3DLayer()
                    material: {
                      color: 'black'
                    },
                    halo: {
                      color: [255, 255, 255, 0.7],
                      size: 2
                    },
                    size: 10
                  }
                ],
                // Labels need a small vertical offset that will be used by the callout
                verticalOffset: {
                  screenLength: 100,
                  maxWorldLength: 2000,
                  minWorldLength: 10
                },
                // The callout has to have a defined type (currently only line is possible)
                // The size, the color and the border color can be customized
                callout: {
                  type: 'line', // autocasts as new LineCallout3D()
                  size: 0.5,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0.7]
                  }
                }
              }
            }
          ]
        });
        label.listMode = 'hide';
        webScene.add(label);
      } //Close function createLabel

      // Add a layer list to enable and disable the layers
      var layerList = new LayerList({
        view: view
      });
      view.ui.add(layerList, {
        position: 'top-right'
      });

    } catch (error) {
      alert('We have an error: ' + error);
    }

  }

  ngOnInit() {
    this.getCurrentUser();
  }

  // Metodo para saber si hay un usuario logeado actualmente.
  getCurrentUser(){
    this.authService.estaAutenticado()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( user => {
      if(user) {
        //Para saber si tiene el rol creador
        this.authService.isUserAdmin(user.uid).subscribe(userRole => {
          if(userRole){
            this.isCreador = Object.assign({}, userRole.perfil.roles).hasOwnProperty('creador');
          }
        });

        //Para obtener la información del usuario logueado.
        this.usuarioService.getUsuario(user.uid)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((usuario: Usuario) => {
          // Obtenemos la información del usuario de la base de datos de firebase.
          this.usuario = usuario;
          if(this.usuario.primerIngreso) {
            this.showPrimerIngresoMessage();
          } else {
            this.initializeMap();
          }
        });
      }
    });
  }

  showPrimerIngresoMessage() {
    Swal.mixin({
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: false,
      allowOutsideClick: false,
      progressSteps: ['1', '2', '3', '4']
    }).queue([
      {
        title: 'Bienvenido a CampusGIS',
        type: 'success'
      },
      {
        title: 'Toma nota',
        type: 'info',
        text: 'Las siguientes credenciales las necesitarás para acceder al mapa del campus'
      },
      {
        title: 'Toma nota',
        type: 'info',
        html: `
        <pre><code>Usuario: carlos.gomez0</code></pre>
        <pre><code>Contraseña: carlos</code></pre>`
      },
      {
        title: 'Credenciales',
        type: 'info',
        text: 'Podrás consultar estás credenciales en cualquier momento desde la configuración de tu cuenta.'
      }
    ]).then((result) => {
      if (result.value) {
        Swal.fire({
          title: '¡Bien hecho!',
          type: 'success',
          text: 'Ya puedes disfrutar de tu cuenta de CampusGIS'
        });
        this.usuario.primerIngreso = false; // Actualizamos la variable de primer ingreso del usuario.
        this.usuarioService.updateUsuario(this.usuario) // Actualizamos el usuario en firebase
        .then(() => {
          this.initializeMap();
        }).catch((err) => {
          this.swal.showErrorMessage(err);
        })
      };
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
