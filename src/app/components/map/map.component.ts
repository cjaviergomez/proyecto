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
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: 'app-esri-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class EsriMapComponent implements OnInit {
  //Esta variable tendra los datos que se le pasarán al formulario de la solicitud(Edificio, capa, objecto)
  @Output() datos_formulario = new EventEmitter();
  private edificio;
  private capa;
  private objecto;

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode', {static:true}) private mapViewEl: ElementRef;

  constructor() {
    this.edificio = '';
    this.capa = '';
    this.objecto = '';
  }

  async initializeMap() {
    try {
      const [WebScene, FeatureLayer, SceneView, LayerList] = await loadModules([
        'esri/WebScene',
        'esri/layers/FeatureLayer',
        'esri/views/SceneView',
        'esri/widgets/LayerList'
      ]);

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
              title: "Ver Reformas",
              // The ID by which to reference the action in the event handler
              id: "ver-reformas",
              // Sets the icon font used to style the action button
              className: "esri-icon-duplicate"
            }
            //Remove the firt action
            view.popup.actions.splice(0, 1);

            // Adds the custom action to the popup.
            view.popup.actions.push(solicitudAction);
            view.popup.actions.push(verSolicitudesAction);
            view.popup.actions.push(verReformasAction);

            // The function to execute when the solicitud action is clicked
            function irAlformulario() {
              window.open("http://localhost:4200/crear-solicitud");
              //Emición de datos
              //this.datos_formulario.emit({ "edificio": this.edificio, "capa": this.capa, "objecto": this.objecto});
            }

            // The function to execute when the solicitud action is clicked
            function irASolicitudes() {
              window.open("http://localhost:4200/solicitudes");
              //Emición de datos
              //this.datos_formulario.emit({ "edificio": this.edificio, "capa": this.capa, "objecto": this.objecto});
            }

            function irAReformas(){
              window.open("http://localhost:4200/reformas");
            }

            // This event fires for each click on any action
            view.popup.on("trigger-action", function(event){
              // If the zoom-out action is clicked, fire the zoomOut() function
              if(event.action.id === "hacer-solicitud"){
                irAlformulario();
              }else if(event.action.id === "ver-solicitudes"){
                irASolicitudes();
              }else if(event.action.id === "ver-reformas"){
                irAReformas();
              }
            });

            view.popup.watch("selectedFeature", function(graphic:any) {
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
            console.log(edificio);
            //this.capa = layer;
            //this.objecto = elemento;
            console.log("Edicicación: " + edificio.title + " Capa: " + layer.title + " ElementoID: " + elemento.OBJECTID_1);
          }

          //Función para crear el label al edificio.
          function createLabel(layer:esri.Layer, lat:number, long:number) {
            var features = [
              {
                attributes: {
                  ObjectID: layer.id,
                },
                geometry: {
                  type: "point",
                  x: long,
                  y: lat
                }
              }
            ];
            var label = new FeatureLayer({
              source: features,  // autocast as a Collection of new Graphic()
              objectIdField: "ObjectID",
              elevationInfo: {
                mode: "relative-to-scene"
              },
              featureReduction: {
                type: "selection"
              },
              returnZ: false,
              // Select peaks higher than 3000m
              definitionExpression: " ObjectID > 0",
              title: "",
              // Set a renderer that will show the points with icon symbols
              renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                  type: "point-3d", // autocasts as new PointSymbol3D()
                  symbolLayers: [
                    {
                      type: "icon", // autocasts as new IconSymbol3DLayer()
                      resource: {
                        primitive: "circle"
                      },
                      material: {
                        color: "black"
                      },
                      size: 5
                    }
                  ]
                }
              },
              outFields: ["*"],
              // Add labels with callouts of type line to the icons
              labelingInfo: [
                {
                  // When using callouts on labels, "above-center" is the only allowed position
                  labelPlacement: "above-center",
                  labelExpressionInfo: {
                    value: layer.title  //Titulo del label
                  },
                  symbol: {
                    type: "label-3d", // autocasts as new LabelSymbol3D()
                    symbolLayers: [
                      {
                        type: "text", // autocasts as new TextSymbol3DLayer()
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
                      type: "line", // autocasts as new LineCallout3D()
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
            label.listMode = "hide";
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
    this.initializeMap();
  }

}
