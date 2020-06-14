'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">proyecto documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link">AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminModule-1f86f06f08b5723e27b9df7088b554b5"' : 'data-target="#xs-components-links-module-AdminModule-1f86f06f08b5723e27b9df7088b554b5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-1f86f06f08b5723e27b9df7088b554b5"' :
                                            'id="xs-components-links-module-AdminModule-1f86f06f08b5723e27b9df7088b554b5"' }>
                                            <li class="link">
                                                <a href="components/ComentarioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ComentarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ComentariosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ComentariosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilAdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TiposDocumentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TiposDocumentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnidadesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnidadesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuariosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuariosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link">AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' : 'data-target="#xs-components-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' :
                                            'id="xs-components-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' : 'data-target="#xs-pipes-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' :
                                            'id="xs-pipes-links-module-AppModule-a94b4381ae8d396ef9bcb6386b5b0666"' }>
                                            <li class="link">
                                                <a href="pipes/FechaNotificacionPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FechaNotificacionPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InModule.html" data-type="entity-link">InModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-InModule-3b260989e8ff544b586300a1ed300614"' : 'data-target="#xs-components-links-module-InModule-3b260989e8ff544b586300a1ed300614"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InModule-3b260989e8ff544b586300a1ed300614"' :
                                            'id="xs-components-links-module-InModule-3b260989e8ff544b586300a1ed300614"' }>
                                            <li class="link">
                                                <a href="components/ConfigComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EsriMapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EsriMapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InRoutingModule.html" data-type="entity-link">InRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MyAddonModule.html" data-type="entity-link">MyAddonModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MyAddonModule-5127fdcbf241d1094e5deafa5eb886e5"' : 'data-target="#xs-components-links-module-MyAddonModule-5127fdcbf241d1094e5deafa5eb886e5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyAddonModule-5127fdcbf241d1094e5deafa5eb886e5"' :
                                            'id="xs-components-links-module-MyAddonModule-5127fdcbf241d1094e5deafa5eb886e5"' }>
                                            <li class="link">
                                                <a href="components/actaFinalizacionObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">actaFinalizacionObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/actaLiquidacionContratoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">actaLiquidacionContratoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/actaLiquidacionObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">actaLiquidacionObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/agregarComentariosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">agregarComentariosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/approveDataTaskComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">approveDataTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/confirmarMaterialesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">confirmarMaterialesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/documentosInicioObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">documentosInicioObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/elegirInterventorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">elegirInterventorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/emitirAvalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">emitirAvalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/emitirResolucionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">emitirResolucionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/entregaReformaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">entregaReformaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/enviarObservacionesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">enviarObservacionesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/finalizarObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">finalizarObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/finalizarReformaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">finalizarReformaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/iniciarObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">iniciarObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/procesoContratacionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">procesoContratacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/realizarMinutaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">realizarMinutaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/recomendarProveedoresComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">recomendarProveedoresComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/revisarDocsReformaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">revisarDocsReformaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/revisarDocumentosFinComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">revisarDocumentosFinComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/revisarInformesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">revisarInformesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/revisarSolicitudComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">revisarSolicitudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/revisionInformeFinancieroComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">revisionInformeFinancieroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/seguimientoObraComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">seguimientoObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/solicitarConceptosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">solicitarConceptosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/startNewProcessComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">startNewProcessComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/subirConceptosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">subirConceptosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/subirCotizacionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">subirCotizacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/subirInformeFinancieroComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">subirInformeFinancieroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/subirInformeSupervisionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">subirInformeSupervisionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/verificarCumplimientoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">verificarCumplimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/verificarDocumentosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">verificarDocumentosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OutModule.html" data-type="entity-link">OutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OutModule-7c21c32383b0c82dfe2e08b1d7f27d82"' : 'data-target="#xs-components-links-module-OutModule-7c21c32383b0c82dfe2e08b1d7f27d82"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OutModule-7c21c32383b0c82dfe2e08b1d7f27d82"' :
                                            'id="xs-components-links-module-OutModule-7c21c32383b0c82dfe2e08b1d7f27d82"' }>
                                            <li class="link">
                                                <a href="components/ContactoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreguntasFrecuentesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreguntasFrecuentesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProcesoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProcesoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPassComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetPassComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserManagerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserManagerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OutRoutingModule.html" data-type="entity-link">OutRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProcesoModule.html" data-type="entity-link">ProcesoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProcesoModule-2d0a62d4549e2ad5a3654c02cdc028ce"' : 'data-target="#xs-components-links-module-ProcesoModule-2d0a62d4549e2ad5a3654c02cdc028ce"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProcesoModule-2d0a62d4549e2ad5a3654c02cdc028ce"' :
                                            'id="xs-components-links-module-ProcesoModule-2d0a62d4549e2ad5a3654c02cdc028ce"' }>
                                            <li class="link">
                                                <a href="components/GenericForm.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GenericForm</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProcesslistComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProcesslistComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartProcessComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StartProcessComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TasklistComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TasklistComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProcesoRoutingModule.html" data-type="entity-link">ProcesoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReformasModule.html" data-type="entity-link">ReformasModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReformasModule-42b9f9ae860a9bad5122ef02deba608b"' : 'data-target="#xs-components-links-module-ReformasModule-42b9f9ae860a9bad5122ef02deba608b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReformasModule-42b9f9ae860a9bad5122ef02deba608b"' :
                                            'id="xs-components-links-module-ReformasModule-42b9f9ae860a9bad5122ef02deba608b"' }>
                                            <li class="link">
                                                <a href="components/ReformaDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReformaDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReformasListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReformasListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReformasRoutingModule.html" data-type="entity-link">ReformasRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SolicitudesModule.html" data-type="entity-link">SolicitudesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' : 'data-target="#xs-components-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' :
                                            'id="xs-components-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' }>
                                            <li class="link">
                                                <a href="components/SolicitudAddErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicitudAddErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudAddedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicitudAddedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicitudDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudesListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicitudesListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' : 'data-target="#xs-injectables-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' :
                                        'id="xs-injectables-links-module-SolicitudesModule-fe103d0db62261bfae45ddfffc0dde05"' }>
                                        <li class="link">
                                            <a href="injectables/SolicitudService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SolicitudService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SolicitudesRoutingModule.html" data-type="entity-link">SolicitudesRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AreaTecnica.html" data-type="entity-link">AreaTecnica</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComunTaskComponent.html" data-type="entity-link">ComunTaskComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Documento.html" data-type="entity-link">Documento</a>
                            </li>
                            <li class="link">
                                <a href="classes/Material.html" data-type="entity-link">Material</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mensaje.html" data-type="entity-link">Mensaje</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyProcessData.html" data-type="entity-link">MyProcessData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Perfil.html" data-type="entity-link">Perfil</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessDefinition.html" data-type="entity-link">ProcessDefinition</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reforma.html" data-type="entity-link">Reforma</a>
                            </li>
                            <li class="link">
                                <a href="classes/StartProcessInstanceComponent.html" data-type="entity-link">StartProcessInstanceComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link">Task</a>
                            </li>
                            <li class="link">
                                <a href="classes/Unidad.html" data-type="entity-link">Unidad</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserManagementActions.html" data-type="entity-link">UserManagementActions</a>
                            </li>
                            <li class="link">
                                <a href="classes/Usuario.html" data-type="entity-link">Usuario</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AreaTecnicaService.html" data-type="entity-link">AreaTecnicaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CamundaRestService.html" data-type="entity-link">CamundaRestService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MaterialesService.html" data-type="entity-link">MaterialesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MensajesService.html" data-type="entity-link">MensajesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificacionService.html" data-type="entity-link">NotificacionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilService.html" data-type="entity-link">PerfilService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReformaService.html" data-type="entity-link">ReformaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShowMessagesService.html" data-type="entity-link">ShowMessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SolicitudService.html" data-type="entity-link">SolicitudService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TiposDocumentsService.html" data-type="entity-link">TiposDocumentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UnidadService.html" data-type="entity-link">UnidadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link">UsuarioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AgregadorGuard.html" data-type="entity-link">AgregadorGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CreadorGuard.html" data-type="entity-link">CreadorGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/SolucionadorGuard.html" data-type="entity-link">SolucionadorGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/VerificadorGuard.html" data-type="entity-link">VerificadorGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Notificacion.html" data-type="entity-link">Notificacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Roles.html" data-type="entity-link">Roles</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Solicitud.html" data-type="entity-link">Solicitud</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});