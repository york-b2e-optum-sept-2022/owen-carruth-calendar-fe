import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './components/nav/nav.component';
import { EventComponent } from './components/event/event.component';
import { EventListComponent } from './components/event-list/event-list.component';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import { EventFormComponent } from './components/event-form/event-form.component';
import { InvitesComponent } from './components/invites/invites.component'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavComponent,
    EventComponent,
    InvitesComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
