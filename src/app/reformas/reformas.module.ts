import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReformasRoutingModule } from './reformas-routing.module';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Components
import { ReformasListComponent } from './components/reformas-list/reformas-list.component';

@NgModule({
  declarations: [
    ReformasListComponent
  ],
  imports: [
    CommonModule,
    ReformasRoutingModule,
    FontAwesomeModule
  ]
})
export class ReformasModule { }
