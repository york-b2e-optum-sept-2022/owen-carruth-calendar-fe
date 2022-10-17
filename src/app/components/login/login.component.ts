import {Component, OnInit} from '@angular/core';
import {ILoginForm} from "../../interfaces/ILoginForm";
import {NgForm} from "@angular/forms";
import {AccountService} from "../../services/account.service";
import {Router} from "@angular/router";
import {first, Subject, takeUntil} from "rxjs";

//TODO - add error handlers and unsubscribe from observables

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string | null = null;
  loginSuccess: boolean = false;
  $componentDestroyed: Subject<boolean> = new Subject()

  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.$loginError.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: loginError => this.loginError = loginError
    })
  }

  ngOnInit(): void {

  }

  onLogin(loginCreds: ILoginForm) {
    console.log(loginCreds)
    this.accountService.login(loginCreds)

    this.accountService.$account.pipe(takeUntil(this.$componentDestroyed)).subscribe({
      next: account => {
        console.log(account)
        this.loginSuccess = !!account
        if (this.loginSuccess) {
          this.router.navigate(['/events'])
        }
      },
      error: err => this.loginError = err
    })
  }

  ngOnDestroy() {
    this.$componentDestroyed.next(true)
    this.$componentDestroyed.complete()
  }
}
