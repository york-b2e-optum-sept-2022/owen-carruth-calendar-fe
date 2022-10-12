import { Component } from '@angular/core';
import {AccountService} from "./services/account.service";
import {first, Subject, takeUntil} from "rxjs";
import {IAccount} from "./interfaces/IAccount";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'owen-carruth-calendar-fe';

  $componentDestroyed: Subject<boolean> = new Subject()


  constructor(private accountService: AccountService) {

  }
  ngOnInit(){

  }

  ngOnDestroy() {
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
    console.log("destroy")
  }
}


