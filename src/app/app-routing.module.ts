import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {EventListComponent} from "./components/event-list/event-list.component";
import {EventFormComponent} from "./components/event-form/event-form.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path:'',redirectTo:'login', pathMatch: 'full' },
  {path: 'register', component: RegisterComponent},
  {path: 'events', component: EventListComponent},
  {path: 'NewEvent', component: EventFormComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
export const routingComponents = [LoginComponent, RegisterComponent, EventListComponent, EventFormComponent]
