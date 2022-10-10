import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {EventListComponent} from "./components/event-list/event-list.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'events', component: EventListComponent},
  {path:'',redirectTo:'login', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
export const routingComponents = [LoginComponent, RegisterComponent]
