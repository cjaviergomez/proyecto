import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReformasRoutingModule } from './reformas-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Components
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';
import { ReformaDetailComponent } from './components/reforma-detail/reforma-detail.component';

@NgModule({
  declarations: [
    ReformasListComponent,
    ReformaDetailComponent
  ],
  imports: [
    CommonModule,
    ReformasRoutingModule,
    FontAwesomeModule
  ]
})
export class ReformasModule { }
