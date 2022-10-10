import { Component } from '@angular/core';
import {AccountService} from "./services/account.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'owen-carruth-calendar-fe';

  isLoggedIn: boolean = false;
  $componentDestroyed: Subject<boolean> = new Subject()
  isRegistering: boolean = false;

  constructor(private accountService: AccountService) {
    this.accountService.$account.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: account => this.isLoggedIn = !!account
    })
  }

  ngOnDestroy() {
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
    console.log("destroy")
  }
}


