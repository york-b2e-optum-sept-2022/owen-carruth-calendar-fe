import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {EventListComponent} from "./components/event-list/event-list.component";
import {EventFormComponent} from "./components/event-form/event-form.component";
import {EventComponent} from "./components/event/event.component";
import {EventDetailsComponent} from "./components/event-details/event-details.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path:'',redirectTo:'login', pathMatch: 'full' },
  {path: 'register', component: RegisterComponent},
  {path: 'events', component: EventListComponent},
  {path: 'NewEvent', component: EventFormComponent},
  {path: 'events/:id', component: EventDetailsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
export const routingComponents = [LoginComponent, RegisterComponent, EventListComponent, EventFormComponent, EventComponent, EventDetailsComponent]
